import {
  EDIT_ADJUST_OPTIONS,
  formatDuration,
  formatSignedDuration,
  timeWithSecondsFormatter,
} from "../lib/contractions";
import { EditingState } from "../hooks/useContractionTracker";

type EditEntryModalProps = {
  editing: EditingState | null;
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
  onAdjust: (field: "start" | "end", deltaSeconds: number) => void;
};

export function EditEntryModal({
  editing,
  onClose,
  onSave,
  onReset,
  onAdjust,
}: EditEntryModalProps) {
  if (!editing) {
    return null;
  }

  const editingDurationSec = Math.max(
    0,
    Math.floor((editing.draftEnd - editing.draftStart) / 1000)
  );
  const editingOriginalDurationSec = Math.max(
    0,
    Math.floor((editing.originalEnd - editing.originalStart) / 1000)
  );
  const editingStartDeltaSec = Math.floor(
    (editing.draftStart - editing.originalStart) / 1000
  );
  const editingEndDeltaSec = Math.floor(
    (editing.draftEnd - editing.originalEnd) / 1000
  );
  const editingDurationDeltaSec =
    editingDurationSec - editingOriginalDurationSec;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333333]/20 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-[#F8F3ED] p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#333333]">
              Adjust entry
            </h2>
            <p className="mt-1 text-sm text-[#666666]">
              Fine-tune the logged times by up to ±2 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-[#999999] transition hover:text-[#333333]"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-[#333333]">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#666666]">
                  Start time
                </p>
                <p className="text-base font-medium text-[#333333]">
                  {timeWithSecondsFormatter.format(
                    new Date(editing.draftStart)
                  )}
                </p>
                <p className="text-xs text-[#666666]">
                  Δ {formatSignedDuration(editingStartDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`start-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("start", seconds)}
                    className="rounded-full border border-[#CFE5D6] bg-[#F8F3ED] px-3 py-1 text-xs font-medium text-[#333333] transition hover:border-[#B8D9C4] hover:bg-[#CFE5D6]"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#666666]">
                  End time
                </p>
                <p className="text-base font-medium text-[#333333]">
                  {timeWithSecondsFormatter.format(new Date(editing.draftEnd))}
                </p>
                <p className="text-xs text-[#666666]">
                  Δ {formatSignedDuration(editingEndDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`end-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("end", seconds)}
                    className="rounded-full border border-[#CFE5D6] bg-[#F8F3ED] px-3 py-1 text-xs font-medium text-[#333333] transition hover:border-[#B8D9C4] hover:bg-[#CFE5D6]"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#CFE5D6] bg-[#CFE5D6] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#666666]">
              Duration
            </p>
            <p className="mt-1 text-xl font-semibold text-[#333333]">
              {formatDuration(editingDurationSec)}
            </p>
            <p className="text-xs text-[#666666]">
              {editingDurationDeltaSec === 0
                ? `Was ${formatDuration(editingOriginalDurationSec)}`
                : `Was ${formatDuration(
                    editingOriginalDurationSec
                  )} (${formatSignedDuration(editingDurationDeltaSec)})`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-[#CFE5D6] bg-[#F8F3ED] px-4 py-2 text-sm font-medium text-[#333333] transition hover:border-[#B8D9C4] hover:bg-[#CFE5D6]"
          >
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#666666] transition hover:text-[#333333]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-full border border-[#CFE5D6] bg-[#CFE5D6] px-4 py-2 text-sm font-semibold text-[#333333] shadow-sm transition hover:bg-[#B8D9C4]"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
