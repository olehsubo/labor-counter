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
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <header className="mb-5 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Today
          </span>
          <div className="text-lg font-semibold text-slate-800">
            {formatSessionLabel(currentSessionId)}
          </div>
        </header>
        <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-600">
          <div className="rounded-2xl bg-sky-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-sky-500">Total</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{stats.totalToday}</p>
            <p className="text-[11px] text-slate-400">Contractions logged</p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-sky-500">
              Avg duration
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {formatDuration(stats.averageDurationSec)}
            </p>
            <p className="text-[11px] text-slate-400">Active phase</p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-sky-500">
              Avg interval
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {stats.hasIntervalData ? formatDuration(stats.averageIntervalSec) : "—"}
            </p>
            <p className="text-[11px] text-slate-400">Rest between</p>
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
            className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isHoldingClear ? "Keep holding to clear" : "Hold to clear today"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          <span>Today&apos;s timeline</span>
          <span>{stats.totalToday} entries</span>
        </header>
        <div className="max-h-80 overflow-y-auto rounded-3xl border border-slate-200 bg-white">
          {timelineEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              No contractions logged yet today.
            </p>
          ) : (
            <div className="divide-y divide-slate-200 text-sm text-slate-700">
              {timelineEntries.map((entry) => {
                const durationLabel = formatDuration(entry.durationSec);
                const intervalLabel =
                  entry.intervalSec != null ? `+${formatDuration(entry.intervalSec)}` : "—";

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onEditEntry(currentSessionId, entry.id)}
                    className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-400"
                  >
                    <span className="font-semibold text-slate-400">#{entry.index}</span>
                    <span className="font-mono text-base tabular-nums text-slate-800">
                      {timeFormatter.format(entry.start)}
                    </span>
                    <span className="font-mono tabular-nums text-slate-900">{durationLabel}</span>
                    <span className="font-mono tabular-nums text-slate-500">{intervalLabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          <span>Past sessions</span>
          <span>{pastSessionIds.length}</span>
        </header>
        {pastSessionIds.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
            Previous days will appear here once logged.
          </p>
        ) : (
          <div className="space-y-4">
            {pastSessionIds.map((sessionId) => {
              const session = sessions[sessionId];
              const entriesForSession = deriveDisplayEntries(session?.entries ?? []);
              const summary = calculateStats(entriesForSession);

              return (
                <details
                  key={sessionId}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-sm text-slate-700"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatSessionLabel(sessionId)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {summary.totalToday} contractions • Avg {formatDuration(summary.averageDurationSec)}
                        {summary.hasIntervalData ? ` • Interval ${formatDuration(summary.averageIntervalSec)}` : ""}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-400">View</span>
                  </summary>
                  <div className="divide-y divide-slate-200">
                    {entriesForSession.length === 0 ? (
                      <p className="px-6 py-6 text-center text-sm text-slate-500">
                        No contractions recorded.
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
                            className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-400"
                          >
                            <span className="font-semibold text-slate-400">#{entry.index}</span>
                            <span className="font-mono text-base tabular-nums text-slate-800">
                              {timeFormatter.format(entry.start)}
                            </span>
                            <span className="font-mono tabular-nums text-slate-900">{durationLabel}</span>
                            <span className="font-mono tabular-nums text-slate-500">{intervalLabel}</span>
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
