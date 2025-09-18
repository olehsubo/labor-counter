import {
  ContractionState,
  DisplayEntry,
  MAX_RECENT_ENTRIES,
  formatDuration,
  timeFormatter,
} from "../lib/contractions";

type LiveViewProps = {
  contractionState: ContractionState;
  displayElapsed: string;
  recentEntries: DisplayEntry[];
  onToggle: () => void;
  onUndo: () => void;
  onNewSession: () => void;
  onShowHistory: () => void;
  onEditEntry: (entryId: string) => void;
};

export function LiveView({
  contractionState,
  displayElapsed,
  recentEntries,
  onToggle,
  onUndo,
  onNewSession,
  onShowHistory,
  onEditEntry,
}: LiveViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-48 w-full flex-col items-center justify-center gap-4 rounded-[32px] border-2 text-xl font-semibold transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 ${
          contractionState === "contracting"
            ? "border-rose-200 bg-rose-100 text-rose-700 shadow-[0_25px_50px_-12px_rgba(244,114,182,0.35)]"
            : "border-sky-200 bg-white text-sky-700 shadow-[0_20px_45px_-15px_rgba(14,165,233,0.35)]"
        } active:scale-[0.99]`}
      >
        <span className="text-5xl font-mono tabular-nums tracking-tight">{displayElapsed}</span>
        <span>
          {contractionState === "contracting" ? "Stop contraction" : "Start contraction"}
        </span>
        {contractionState === "contracting" ? (
          <span className="text-xs uppercase tracking-[0.35em] text-rose-500">Contracting</span>
        ) : (
          <span className="text-xs uppercase tracking-[0.35em] text-sky-500">Ready</span>
        )}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onUndo}
          disabled={recentEntries.length === 0}
          className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Undo last
        </button>
        <button
          type="button"
          onClick={onNewSession}
          className="rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
        >
          New session
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="rounded-full border border-transparent px-5 py-2 text-sm font-medium text-sky-600 underline-offset-4 transition hover:underline"
        >
          View full history
        </button>
      </div>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          <span>Recent</span>
          <span>Last {Math.min(recentEntries.length, MAX_RECENT_ENTRIES)}</span>
        </header>
        <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {recentEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              Contractions will appear here with their durations and intervals.
            </p>
          ) : (
            recentEntries.map((entry) => {
              const durationLabel = formatDuration(entry.durationSec);
              const intervalLabel =
                entry.intervalSec != null ? `+${formatDuration(entry.intervalSec)}` : "—";

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onEditEntry(entry.id)}
                  className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-400"
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
      </section>
    </div>
  );
}
