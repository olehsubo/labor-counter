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
        className={`flex h-48 w-full flex-col items-center justify-center gap-4 rounded-[32px] border-2 text-xl font-semibold transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CFE5D6] ${
          contractionState === "contracting"
            ? "border-[#FADADD] bg-[#FADADD] text-[#333333] shadow-[0_25px_50px_-12px_rgba(250,218,221,0.35)]"
            : "border-[#CFE5D6] bg-[#F8F3ED] text-[#333333] shadow-[0_20px_45px_-15px_rgba(207,229,214,0.35)]"
        } active:scale-[0.99]`}
      >
        <span className="text-5xl font-mono tabular-nums tracking-tight">
          {displayElapsed}
        </span>
        <span>
          {contractionState === "contracting"
            ? "Stop contraction"
            : "Start contraction"}
        </span>
        {contractionState === "contracting" ? (
          <span className="text-xs uppercase tracking-[0.35em] text-[#666666]">
            Contracting
          </span>
        ) : (
          <span className="text-xs uppercase tracking-[0.35em] text-[#666666]">
            Ready
          </span>
        )}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onUndo}
          disabled={recentEntries.length === 0}
          className="rounded-full border border-[#CFE5D6] bg-[#CFE5D6] px-5 py-2 text-sm font-medium text-[#333333] transition hover:border-[#B8D9C4] hover:bg-[#B8D9C4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Undo last
        </button>
        <button
          type="button"
          onClick={onNewSession}
          className="rounded-full border border-[#D7EAF3] bg-[#D7EAF3] px-5 py-2 text-sm font-medium text-[#333333] transition hover:border-[#C5E1F0] hover:bg-[#C5E1F0]"
        >
          New session
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="rounded-full border border-transparent px-5 py-2 text-sm font-medium text-[#666666] underline-offset-4 transition hover:underline hover:text-[#333333]"
        >
          View full history
        </button>
      </div>

      <section className="space-y-4">
        <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-[#666666]">
          <span>Recent</span>
          <span>Last {Math.min(recentEntries.length, MAX_RECENT_ENTRIES)}</span>
        </header>
        <div className="divide-y divide-[#CFE5D6] overflow-hidden rounded-3xl border border-[#CFE5D6] bg-[#F8F3ED]">
          {recentEntries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[#666666]">
              Contractions will appear here with their durations and intervals.
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
                  className="grid w-full grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-left text-sm text-[#333333] transition hover:bg-[#CFE5D6] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#CFE5D6]"
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
      </section>
    </div>
  );
}
