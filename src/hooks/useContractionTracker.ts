import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ContractionLogEntry,
  ContractionState,
  DisplayEntry,
  Session,
  StatsSummary,
  StoredData,
  buildSession,
  calculateStats,
  deriveDisplayEntries,
  formatDuration,
  generateId,
  getTodaySessionId,
  MAX_DURATION_SEC,
  MAX_RECENT_ENTRIES,
  MIN_DURATION_SEC,
  sortEntriesChronologically,
  STORAGE_KEY,
  STORAGE_WARNING_RATIO,
} from "../lib/contractions";

const TAP_DEBOUNCE_MS = 1000;

export type EditingState = {
  sessionId: string;
  entryId: string;
  draftStart: number;
  draftEnd: number;
  originalStart: number;
  originalEnd: number;
};

type ConfirmationModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  onConfirm: () => void;
};

type UseContractionTrackerReturn = {
  contractionState: ContractionState;
  displayElapsed: string;
  timelineEntries: DisplayEntry[];
  recentEntries: DisplayEntry[];
  stats: StatsSummary;
  storageWarning: boolean;
  sessions: Record<string, Session>;
  currentSessionId: string;
  undoLast: () => void;
  startNewSession: () => void;
  toggleContraction: () => void;
  clearCurrentSession: () => void;
  openEditor: (sessionId: string, entryId: string) => void;
  editing: EditingState | null;
  adjustEditingTime: (field: "start" | "end", deltaSeconds: number) => void;
  resetEditingDraft: () => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  confirmationModal: ConfirmationModalState;
  closeConfirmationModal: () => void;
};

export function useContractionTracker(): UseContractionTrackerReturn {
  const initialSessionId = useMemo(() => getTodaySessionId(), []);

  const [contractionState, setContractionState] =
    useState<ContractionState>("idle");
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessions, setSessions] = useState<Record<string, Session>>(() => ({
    [initialSessionId]: buildSession(initialSessionId),
  }));
  const [currentSessionId, setCurrentSessionId] = useState(initialSessionId);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalState>({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  const lastTapRef = useRef<number>(0);

  const currentSession =
    sessions[currentSessionId] ?? buildSession(currentSessionId);

  const timelineEntries = useMemo(
    () => deriveDisplayEntries(currentSession.entries),
    [currentSession.entries]
  );

  const recentEntries = useMemo(() => {
    const subset = timelineEntries.slice(-MAX_RECENT_ENTRIES);
    return [...subset].reverse();
  }, [timelineEntries]);

  const stats = useMemo<StatsSummary>(
    () => calculateStats(timelineEntries),
    [timelineEntries]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredData;
        if (parsed && typeof parsed === "object") {
          const hydratedSessions: Record<string, Session> = {};
          Object.entries(parsed.sessions ?? {}).forEach(([id, session]) => {
            if (!session || typeof session !== "object") {
              return;
            }
            hydratedSessions[id] = buildSession(id, session.entries ?? []);
          });

          if (Object.keys(hydratedSessions).length === 0) {
            hydratedSessions[initialSessionId] = buildSession(initialSessionId);
          }

          setSessions(hydratedSessions);

          if (
            parsed.currentSessionId &&
            hydratedSessions[parsed.currentSessionId]
          ) {
            setCurrentSessionId(parsed.currentSessionId);
          } else {
            setCurrentSessionId((prev) =>
              hydratedSessions[prev] ? prev : initialSessionId
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to hydrate session data", error);
    } finally {
      setHasHydrated(true);
    }
  }, [initialSessionId]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    setSessions((prev) => {
      if (prev[currentSessionId]) {
        return prev;
      }
      return {
        ...prev,
        [currentSessionId]: buildSession(currentSessionId),
      };
    });
  }, [currentSessionId, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }

    const payload: StoredData = {
      currentSessionId,
      sessions,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to persist session data", error);
    }
  }, [currentSessionId, hasHydrated, sessions]);

  useEffect(() => {
    const checkForRollover = () => {
      const todayId = getTodaySessionId();
      setCurrentSessionId((prev) => {
        if (prev === todayId) {
          return prev;
        }

        setSessions((existing) => {
          if (existing[todayId]) {
            return existing;
          }
          return {
            ...existing,
            [todayId]: buildSession(todayId),
          };
        });

        return todayId;
      });
    };

    checkForRollover();
    const intervalId = window.setInterval(checkForRollover, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const estimateStorage = async () => {
      if (
        !("storage" in navigator) ||
        typeof navigator.storage?.estimate !== "function"
      ) {
        setStorageWarning(false);
        return;
      }

      try {
        const estimate = await navigator.storage.estimate();
        if (!estimate.quota) {
          setStorageWarning(false);
          return;
        }
        const usageRatio = (estimate.usage ?? 0) / estimate.quota;
        setStorageWarning(usageRatio >= STORAGE_WARNING_RATIO);
      } catch (error) {
        console.error("Failed to estimate storage", error);
        setStorageWarning(false);
      }
    };

    void estimateStorage();
  }, [sessions]);

  const handleStart = useCallback(() => {
    if (contractionState === "contracting") {
      return;
    }

    setStartTimestamp(Date.now());
    setElapsedSec(0);
    setContractionState("contracting");
    void navigator.vibrate?.(40);
  }, [contractionState]);

  const stopContraction = useCallback(
    (options: { auto?: boolean } = {}) => {
      if (contractionState !== "contracting" || startTimestamp == null) {
        return;
      }

      const now = Date.now();
      const rawElapsedSec = Math.floor((now - startTimestamp) / 1000);
      if (!options.auto && rawElapsedSec < MIN_DURATION_SEC) {
        return;
      }

      const durationSec = Math.min(rawElapsedSec, MAX_DURATION_SEC);
      const end = startTimestamp + durationSec * 1000;

      setSessions((prev) => {
        const sessionId = currentSessionId;
        const existing = prev[sessionId] ?? buildSession(sessionId);
        const nextEntry: ContractionLogEntry = {
          id: generateId(),
          start: startTimestamp,
          end,
          createdAt: Date.now(),
        };

        const updatedEntries = sortEntriesChronologically([
          ...existing.entries,
          nextEntry,
        ]);

        return {
          ...prev,
          [sessionId]: {
            ...existing,
            entries: updatedEntries,
          },
        };
      });

      setContractionState("idle");
      setStartTimestamp(null);
      setElapsedSec(0);
      void navigator.vibrate?.(20);
    },
    [contractionState, currentSessionId, startTimestamp]
  );

  const toggleContraction = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < TAP_DEBOUNCE_MS) {
      return;
    }
    lastTapRef.current = now;

    if (contractionState === "idle") {
      handleStart();
      return;
    }

    stopContraction();
  }, [contractionState, handleStart, stopContraction]);

  useEffect(() => {
    if (contractionState !== "contracting" || startTimestamp == null) {
      return undefined;
    }

    const tick = () => {
      const now = Date.now();
      const nextElapsed = Math.floor((now - startTimestamp) / 1000);

      if (nextElapsed >= MAX_DURATION_SEC) {
        stopContraction({ auto: true });
        return;
      }

      setElapsedSec(nextElapsed);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [contractionState, startTimestamp, stopContraction]);

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const undoLast = useCallback(() => {
    const session = sessions[currentSessionId];
    if (!session || session.entries.length === 0) {
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: "Undo Last Entry",
      message: "Undo the most recent contraction entry?",
      confirmText: "Undo",
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: () => {
        setSessions((prev) => {
          const existing = prev[currentSessionId];
          if (!existing || existing.entries.length === 0) {
            return prev;
          }

          const updatedEntries = sortEntriesChronologically(
            existing.entries
          ).slice(0, -1);

          return {
            ...prev,
            [currentSessionId]: {
              ...existing,
              entries: updatedEntries,
            },
          };
        });
        closeConfirmationModal();
      },
    });
  }, [currentSessionId, sessions, closeConfirmationModal]);

  const startNewSession = useCallback(() => {
    const todayId = getTodaySessionId();

    setConfirmationModal({
      isOpen: true,
      title: "Start New Session",
      message:
        "Start a fresh session for today? Previous entries stay in history.",
      confirmText: "Start New Session",
      cancelText: "Cancel",
      variant: "default",
      onConfirm: () => {
        setSessions((prev) => {
          if (prev[todayId]) {
            return prev;
          }
          return {
            ...prev,
            [todayId]: buildSession(todayId),
          };
        });

        setCurrentSessionId(todayId);
        closeConfirmationModal();
      },
    });
  }, [closeConfirmationModal]);

  const openEditor = useCallback(
    (sessionId: string, entryId: string) => {
      const session = sessions[sessionId];
      if (!session) {
        return;
      }

      const target = session.entries.find((item) => item.id === entryId);
      if (!target) {
        return;
      }

      setEditing({
        sessionId,
        entryId,
        draftStart: target.start,
        draftEnd: target.end,
        originalStart: target.start,
        originalEnd: target.end,
      });
    },
    [sessions]
  );

  const adjustEditingTime = useCallback(
    (field: "start" | "end", deltaSeconds: number) => {
      setEditing((previous) => {
        if (!previous) {
          return previous;
        }

        const base =
          field === "start" ? previous.originalStart : previous.originalEnd;
        const min = base - 120_000;
        const max = base + 120_000;
        const draftKey = field === "start" ? "draftStart" : "draftEnd";

        let nextValue = previous[draftKey] + deltaSeconds * 1000;
        nextValue = Math.min(Math.max(nextValue, min), max);

        if (field === "start") {
          nextValue = Math.min(
            nextValue,
            previous.draftEnd - MIN_DURATION_SEC * 1000
          );
        } else {
          nextValue = Math.max(
            nextValue,
            previous.draftStart + MIN_DURATION_SEC * 1000
          );
        }

        return {
          ...previous,
          [draftKey]: nextValue,
        };
      });
    },
    []
  );

  const resetEditingDraft = useCallback(() => {
    setEditing((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        draftStart: previous.originalStart,
        draftEnd: previous.originalEnd,
      };
    });
  }, []);

  const saveEdit = useCallback(() => {
    if (!editing) {
      return;
    }

    const nextDurationSec = Math.floor(
      (editing.draftEnd - editing.draftStart) / 1000
    );
    if (nextDurationSec < MIN_DURATION_SEC) {
      if (typeof window !== "undefined") {
        window.alert(`Duration must be at least ${MIN_DURATION_SEC} seconds.`);
      }
      return;
    }

    if (
      typeof window !== "undefined" &&
      !window.confirm("Save changes to this entry?")
    ) {
      return;
    }

    setSessions((prev) => {
      const session = prev[editing.sessionId];
      if (!session) {
        return prev;
      }

      const updatedEntries = session.entries.map((entry) =>
        entry.id === editing.entryId
          ? {
              ...entry,
              start: editing.draftStart,
              end: editing.draftEnd,
            }
          : entry
      );

      return {
        ...prev,
        [editing.sessionId]: {
          ...session,
          entries: sortEntriesChronologically(updatedEntries),
        },
      };
    });

    setEditing(null);
    void navigator.vibrate?.(15);
  }, [editing]);

  const cancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const clearCurrentSession = useCallback(() => {
    setSessions((prev) => {
      const existing = prev[currentSessionId];
      if (!existing || existing.entries.length === 0) {
        return prev;
      }

      void navigator.vibrate?.(10);

      return {
        ...prev,
        [currentSessionId]: {
          ...existing,
          entries: [],
        },
      };
    });
  }, [currentSessionId]);

  const displayElapsed = useMemo(() => {
    if (contractionState !== "contracting") {
      return "00:00";
    }
    return formatDuration(elapsedSec);
  }, [contractionState, elapsedSec]);

  return {
    contractionState,
    displayElapsed,
    timelineEntries,
    recentEntries,
    stats,
    storageWarning,
    sessions,
    currentSessionId,
    undoLast,
    startNewSession,
    toggleContraction,
    clearCurrentSession,
    openEditor,
    editing,
    adjustEditingTime,
    resetEditingDraft,
    saveEdit,
    cancelEdit,
    confirmationModal,
    closeConfirmationModal,
  };
}
