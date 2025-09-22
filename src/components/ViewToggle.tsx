export type ViewMode = "live" | "history";

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="mx-auto flex rounded-full bg-theme-surface/70 p-1 shadow-sm ring-1 ring-theme-border">
      <button
        type="button"
        onClick={() => onChange("live")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "live"
            ? "bg-theme-accent text-theme-text shadow"
            : "text-theme-text-secondary hover:text-theme-text"
        }`}
      >
        Live Timer
      </button>
      <button
        type="button"
        onClick={() => onChange("history")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "history"
            ? "bg-theme-accent text-theme-text shadow"
            : "text-theme-text-secondary hover:text-theme-text"
        }`}
      >
        History
      </button>
    </div>
  );
}
