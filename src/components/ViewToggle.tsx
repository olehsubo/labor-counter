export type ViewMode = "live" | "history";

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="mx-auto flex rounded-full bg-[#F8F3ED]/70 p-1 shadow-sm ring-1 ring-[#CFE5D6]">
      <button
        type="button"
        onClick={() => onChange("live")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "live"
            ? "bg-[#CFE5D6] text-[#333333] shadow"
            : "text-[#666666] hover:text-[#333333]"
        }`}
      >
        Live Timer
      </button>
      <button
        type="button"
        onClick={() => onChange("history")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
          mode === "history"
            ? "bg-[#CFE5D6] text-[#333333] shadow"
            : "text-[#666666] hover:text-[#333333]"
        }`}
      >
        History
      </button>
    </div>
  );
}
