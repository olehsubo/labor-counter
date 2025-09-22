import { useEffect, useMemo, useRef, useState } from "react";

import {
  DisplayEntry,
  Session,
  StatsSummary,
  calculateStats,
  deriveDisplayEntries,
  formatDuration,
  formatSessionLabel,
  timeFormatter,
} from "../lib/contractions";

type HistoryViewProps = {
  currentSessionId: string;
  sessions: Record<string, Session>;
  timelineEntries: DisplayEntry[];
  stats: StatsSummary;
  onEditEntry: (sessionId: string, entryId: string) => void;
  onClearToday: () => void;
};

export function HistoryView({
  currentSessionId,
  sessions,
  timelineEntries,
  stats,
  onEditEntry,
  onClearToday,
}: HistoryViewProps) {
  const [isHoldingClear, setIsHoldingClear] = useState(false);
  const clearTimeoutRef = useRef<number | null>(null);

  const pastSessionIds = useMemo(() => {
    return Object.keys(sessions)
      .filter((id) => id !== currentSessionId)
      .sort((a, b) => b.localeCompare(a));
  }, [currentSessionId, sessions]);

  const beginClearHold = () => {
    if (timelineEntries.length === 0 || clearTimeoutRef.current != null) {
      return;
    }

    setIsHoldingClear(true);
    clearTimeoutRef.current = window.setTimeout(() => {
      clearTimeoutRef.current = null;
      setIsHoldingClear(false);
      onClearToday();
    }, 1500);
  };

  const cancelClearHold = () => {
    if (clearTimeoutRef.current != null) {
      window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
    if (isHoldingClear) {
      setIsHoldingClear(false);
    }
  };

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current != null) {
        window.clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-theme-border bg-theme-surface px-4 py-5 shadow-sm sm:px-6">
        <header className="mb-5 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-theme-text-secondary">
            Today
          </span>
          <div className="text-lg font-semibold text-theme-text">
            {formatSessionLabel(currentSessionId)}
          </div>
        </header>
        <div className="grid grid-cols-1 gap-3 text-center text-sm sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl bg-theme-accent-light px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-theme-text">
              {stats.totalToday}
            </p>
            <p className="text-[11px] text-theme-text-secondary">Logged</p>
          </div>
          <div className="rounded-2xl bg-theme-accent px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
              Avg duration
            </p>
            <p className="mt-2 text-2xl font-semibold text-theme-text">
              {formatDuration(stats.averageDurationSec)}
            </p>
            <p className="text-[11px] text-theme-text-secondary">Duration</p>
          </div>
          <div className="rounded-2xl bg-theme-accent-orange px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
              Avg interval
            </p>
            <p className="mt-2 text-2xl font-semibold text-theme-text">
              {stats.hasIntervalData
                ? formatDuration(stats.averageIntervalSec)
                : "—"}
            </p>
            <p className="text-[11px] text-theme-text-secondary">Between</p>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onPointerDown={beginClearHold}
            onPointerUp={cancelClearHold}
            onPointerLeave={cancelClearHold}
            onPointerCancel={cancelClearHold}
            disabled={timelineEntries.length === 0}
            className="rounded-full border border-theme-accent-pink bg-theme-accent-pink px-5 py-2 text-sm font-medium text-theme-text transition hover:border-theme-accent-pink-hover hover:bg-theme-accent-pink-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isHoldingClear ? "Keep holding..." : "Hold to clear"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
          <span>Timeline</span>
          <span>{stats.totalToday}</span>
        </header>
        <div className="max-h-80 overflow-y-auto rounded-3xl border border-theme-border bg-theme-surface">
          {timelineEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-theme-text-secondary">
              No contractions yet today
            </p>
          ) : (
            <div className="divide-y divide-theme-border text-sm text-theme-text">
              {timelineEntries.map((entry) => {
                const durationLabel = formatDuration(entry.durationSec);
                const intervalLabel =
                  entry.intervalSec != null
                    ? `+${formatDuration(entry.intervalSec)}`
                    : "—";

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onEditEntry(currentSessionId, entry.id)}
                    className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-theme-accent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-theme-accent"
                  >
                    <span className="font-semibold text-theme-text-secondary">
                      #{entry.index}
                    </span>
                    <span className="font-mono text-base tabular-nums text-theme-text">
                      {timeFormatter.format(entry.start)}
                    </span>
                    <span className="font-mono tabular-nums text-theme-text">
                      {durationLabel}
                    </span>
                    <span className="font-mono tabular-nums text-theme-text-secondary">
                      {intervalLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
          <span>Previous days</span>
          <span>{pastSessionIds.length}</span>
        </header>
        {pastSessionIds.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-theme-border px-6 py-10 text-center text-sm text-theme-text-secondary">
            Previous days will appear here
          </p>
        ) : (
          <div className="space-y-4">
            {pastSessionIds.map((sessionId) => {
              const session = sessions[sessionId];
              const entriesForSession = deriveDisplayEntries(
                session?.entries ?? []
              );
              const summary = calculateStats(entriesForSession);

              return (
                <details
                  key={sessionId}
                  className="overflow-hidden rounded-3xl border border-theme-border bg-theme-surface text-sm text-theme-text"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition hover:bg-theme-accent">
                    <div>
                      <p className="text-sm font-semibold text-theme-text">
                        {formatSessionLabel(sessionId)}
                      </p>
                      <p className="text-xs text-theme-text-secondary">
                        {summary.totalToday} contractions •{" "}
                        {formatDuration(summary.averageDurationSec)} avg
                        {summary.hasIntervalData
                          ? ` • ${formatDuration(
                              summary.averageIntervalSec
                            )} between`
                          : ""}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.35em] text-theme-text-secondary">
                      View
                    </span>
                  </summary>
                  <div className="divide-y divide-theme-border">
                    {entriesForSession.length === 0 ? (
                      <p className="px-6 py-6 text-center text-sm text-theme-text-secondary">
                        No contractions
                      </p>
                    ) : (
                      entriesForSession.map((entry) => {
                        const durationLabel = formatDuration(entry.durationSec);
                        const intervalLabel =
                          entry.intervalSec != null
                            ? `+${formatDuration(entry.intervalSec)}`
                            : "—";

                        return (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => onEditEntry(sessionId, entry.id)}
                            className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-theme-accent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-theme-accent"
                          >
                            <span className="font-semibold text-theme-text-secondary">
                              #{entry.index}
                            </span>
                            <span className="font-mono text-base tabular-nums text-theme-text">
                              {timeFormatter.format(entry.start)}
                            </span>
                            <span className="font-mono tabular-nums text-theme-text">
                              {durationLabel}
                            </span>
                            <span className="font-mono tabular-nums text-theme-text-secondary">
                              {intervalLabel}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
