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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-theme-text/20 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-theme-surface p-6 shadow-xl border border-theme-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              Adjust entry
            </h2>
            <p className="mt-1 text-sm text-theme-text-secondary">
              Fine-tune the logged times by up to ±2 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-theme-text-secondary transition hover:text-theme-text"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-theme-text">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-theme-text-secondary">
                  Start time
                </p>
                <p className="text-base font-medium text-theme-text">
                  {timeWithSecondsFormatter.format(
                    new Date(editing.draftStart)
                  )}
                </p>
                <p className="text-xs text-theme-text-secondary">
                  Δ {formatSignedDuration(editingStartDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`start-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("start", seconds)}
                    className="rounded-full border border-theme-accent bg-theme-surface px-3 py-1 text-xs font-medium text-theme-text transition hover:border-theme-accent-hover hover:bg-theme-accent"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-theme-text-secondary">
                  End time
                </p>
                <p className="text-base font-medium text-theme-text">
                  {timeWithSecondsFormatter.format(new Date(editing.draftEnd))}
                </p>
                <p className="text-xs text-theme-text-secondary">
                  Δ {formatSignedDuration(editingEndDeltaSec)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {EDIT_ADJUST_OPTIONS.map((seconds) => (
                  <button
                    key={`end-${seconds}`}
                    type="button"
                    onClick={() => onAdjust("end", seconds)}
                    className="rounded-full border border-theme-accent bg-theme-surface px-3 py-1 text-xs font-medium text-theme-text transition hover:border-theme-accent-hover hover:bg-theme-accent"
                  >
                    {formatSignedDuration(seconds)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-theme-accent bg-theme-accent px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-theme-text-secondary">
              Duration
            </p>
            <p className="mt-1 text-xl font-semibold text-theme-text">
              {formatDuration(editingDurationSec)}
            </p>
            <p className="text-xs text-theme-text-secondary">
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
            className="rounded-full border border-theme-accent bg-theme-surface px-4 py-2 text-sm font-medium text-theme-text transition hover:border-theme-accent-hover hover:bg-theme-accent"
          >
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-theme-text-secondary transition hover:text-theme-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-full border border-theme-accent bg-theme-accent px-4 py-2 text-sm font-semibold text-theme-text shadow-sm transition hover:bg-theme-accent-hover"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
