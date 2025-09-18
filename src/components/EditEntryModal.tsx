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
  const editingStartDeltaSec = Math.floor((editing.draftStart - editing.originalStart) / 1000);
  const editingEndDeltaSec = Math.floor((editing.draftEnd - editing.originalEnd) / 1000);
  const editingDurationDeltaSec = editingDurationSec - editingOriginalDurationSec;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Adjust entry</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fine-tune the logged times by up to ±2 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-slate-400 transition hover:text-slate-600"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Start time
                </p>
                <p className="text-base font-medium text-slate-900">
                  {timeWithSecondsFormatter.format(new Date(editing.draftStart))}
                </p>
                <p className="text-xs text-slate-500">
                  Δ {formatSignedDuration(editingStartDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`start-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("start", seconds)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  End time
                </p>
                <p className="text-base font-medium text-slate-900">
                  {timeWithSecondsFormatter.format(new Date(editing.draftEnd))}
                </p>
                <p className="text-xs text-slate-500">
                  Δ {formatSignedDuration(editingEndDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`end-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("end", seconds)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Duration</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {formatDuration(editingDurationSec)}
            </p>
            <p className="text-xs text-slate-500">
              {editingDurationDeltaSec === 0
                ? `Was ${formatDuration(editingOriginalDurationSec)}`
                : `Was ${formatDuration(editingOriginalDurationSec)} (${formatSignedDuration(editingDurationDeltaSec)})`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
