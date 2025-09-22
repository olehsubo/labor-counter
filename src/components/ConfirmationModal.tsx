type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "warning" | "danger";
};

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          icon: "⚠️",
          confirmButton:
            "rounded-full border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-amber-600 transition hover:text-amber-700",
        };
      case "danger":
        return {
          icon: "🗑️",
          confirmButton:
            "rounded-full border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-red-600 transition hover:text-red-700",
        };
      default:
        return {
          icon: "❓",
          confirmButton:
            "rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-sky-600 transition hover:text-sky-700",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{styles.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-slate-400 transition hover:text-slate-600"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
