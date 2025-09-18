export type ViewMode = "live" | "history";

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="mx-auto flex rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-slate-100">
      <button
        type="button"
        onClick={() => onChange("live")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "live" ? "bg-sky-500 text-white shadow" : "text-slate-600 hover:text-slate-800"
        }`}
      >
        Live Timer
      </button>
      <button
        type="button"
        onClick={() => onChange("history")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "history"
            ? "bg-sky-500 text-white shadow"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        History
      </button>
    </div>
  );
}
