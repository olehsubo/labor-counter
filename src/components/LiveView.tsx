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
        className={`flex h-48 w-full flex-col items-center justify-center gap-4 rounded-[32px] border-2 text-xl font-semibold transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-accent ${
          contractionState === "contracting"
            ? "border-theme-accent-pink bg-theme-accent-pink text-theme-text shadow-[0_25px_50px_-12px_var(--theme-shadow-pink)]"
            : "border-theme-accent bg-theme-surface text-theme-text shadow-[0_20px_45px_-15px_var(--theme-shadow)]"
        } active:scale-[0.99]`}
      >
        <span className="text-5xl font-mono tabular-nums tracking-tight">
          {displayElapsed}
        </span>
        <span>{contractionState === "contracting" ? "Stop" : "Start"}</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onUndo}
          disabled={recentEntries.length === 0}
          className="rounded-full border border-theme-accent bg-theme-accent px-5 py-2 text-sm font-medium text-theme-text transition hover:border-theme-accent-hover hover:bg-theme-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onNewSession}
          className="rounded-full border border-theme-accent-light bg-theme-accent-light px-5 py-2 text-sm font-medium text-theme-text transition hover:border-theme-accent-light/80 hover:bg-theme-accent-light/80"
        >
          New Day
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="rounded-full border border-transparent px-5 py-2 text-sm font-medium text-theme-text-secondary underline-offset-4 transition hover:underline hover:text-theme-text"
        >
          History
        </button>
      </div>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-theme-text-secondary">
          <span>Recent</span>
          <span>{Math.min(recentEntries.length, MAX_RECENT_ENTRIES)}</span>
        </header>
        <div className="divide-y divide-theme-border overflow-hidden rounded-3xl border border-theme-border bg-theme-surface">
          {recentEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-theme-text-secondary">
              Your contractions will appear here
            </p>
          ) : (
            recentEntries.map((entry) => {
              const durationLabel = formatDuration(entry.durationSec);
              const intervalLabel =
                entry.intervalSec != null
                  ? `+${formatDuration(entry.intervalSec)}`
                  : "—";

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onEditEntry(entry.id)}
                  className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left text-sm text-theme-text transition hover:bg-theme-accent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-theme-accent"
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
      </section>
    </div>
  );
}
