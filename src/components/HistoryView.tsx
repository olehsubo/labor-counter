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
      <section className="rounded-3xl border border-[#CFE5D6] bg-[#F8F3ED] px-4 py-5 shadow-sm sm:px-6">
        <header className="mb-5 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#666666]">
            Today
          </span>
          <div className="text-lg font-semibold text-[#333333]">
            {formatSessionLabel(currentSessionId)}
          </div>
        </header>
        <div className="grid grid-cols-1 gap-3 text-center text-sm sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl bg-[#D7EAF3] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#333333]">
              {stats.totalToday}
            </p>
            <p className="text-[11px] text-[#666666]">Logged</p>
          </div>
          <div className="rounded-2xl bg-[#CFE5D6] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
              Avg duration
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#333333]">
              {formatDuration(stats.averageDurationSec)}
            </p>
            <p className="text-[11px] text-[#666666]">Duration</p>
          </div>
          <div className="rounded-2xl bg-[#FFE4D1] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
              Avg interval
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#333333]">
              {stats.hasIntervalData
                ? formatDuration(stats.averageIntervalSec)
                : "—"}
            </p>
            <p className="text-[11px] text-[#666666]">Between</p>
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
            className="rounded-full border border-[#FADADD] bg-[#FADADD] px-5 py-2 text-sm font-medium text-[#333333] transition hover:border-[#F7C5CA] hover:bg-[#F7C5CA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isHoldingClear ? "Keep holding..." : "Hold to clear"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
          <span>Timeline</span>
          <span>{stats.totalToday}</span>
        </header>
        <div className="max-h-80 overflow-y-auto rounded-3xl border border-[#CFE5D6] bg-[#F8F3ED]">
          {timelineEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[#666666]">
              No contractions yet today
            </p>
          ) : (
            <div className="divide-y divide-[#CFE5D6] text-sm text-[#333333]">
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
                    className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-[#CFE5D6] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#CFE5D6]"
                  >
                    <span className="font-semibold text-[#666666]">
                      #{entry.index}
                    </span>
                    <span className="font-mono text-base tabular-nums text-[#333333]">
                      {timeFormatter.format(entry.start)}
                    </span>
                    <span className="font-mono tabular-nums text-[#333333]">
                      {durationLabel}
                    </span>
                    <span className="font-mono tabular-nums text-[#666666]">
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
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
          <span>Previous days</span>
          <span>{pastSessionIds.length}</span>
        </header>
        {pastSessionIds.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[#CFE5D6] px-6 py-10 text-center text-sm text-[#666666]">
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
                  className="overflow-hidden rounded-3xl border border-[#CFE5D6] bg-[#F8F3ED] text-sm text-[#333333]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#CFE5D6]">
                    <div>
                      <p className="text-sm font-semibold text-[#333333]">
                        {formatSessionLabel(sessionId)}
                      </p>
                      <p className="text-xs text-[#666666]">
                        {summary.totalToday} contractions •{" "}
                        {formatDuration(summary.averageDurationSec)} avg
                        {summary.hasIntervalData
                          ? ` • ${formatDuration(
                              summary.averageIntervalSec
                            )} between`
                          : ""}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.35em] text-[#666666]">
                      View
                    </span>
                  </summary>
                  <div className="divide-y divide-[#CFE5D6]">
                    {entriesForSession.length === 0 ? (
                      <p className="px-6 py-6 text-center text-sm text-[#666666]">
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
                            className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-[#CFE5D6] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#CFE5D6]"
                          >
                            <span className="font-semibold text-[#666666]">
                              #{entry.index}
                            </span>
                            <span className="font-mono text-base tabular-nums text-[#333333]">
                              {timeFormatter.format(entry.start)}
                            </span>
                            <span className="font-mono tabular-nums text-[#333333]">
                              {durationLabel}
                            </span>
                            <span className="font-mono tabular-nums text-[#666666]">
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
