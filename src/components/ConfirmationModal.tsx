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
            "rounded-full border border-theme-accent-orange bg-theme-accent-orange px-4 py-2 text-sm font-semibold text-theme-text shadow-sm transition hover:bg-theme-accent-orange/80",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-theme-text-secondary transition hover:text-theme-text",
        };
      case "danger":
        return {
          icon: "🗑️",
          confirmButton:
            "rounded-full border border-theme-accent-pink bg-theme-accent-pink px-4 py-2 text-sm font-semibold text-theme-text shadow-sm transition hover:bg-theme-accent-pink-hover",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-theme-text-secondary transition hover:text-theme-text",
        };
      default:
        return {
          icon: "❓",
          confirmButton:
            "rounded-full border border-theme-accent bg-theme-accent px-4 py-2 text-sm font-semibold text-theme-text shadow-sm transition hover:bg-theme-accent-hover",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-theme-text-secondary transition hover:text-theme-text",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-theme-text/20 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-theme-surface p-6 shadow-xl border border-theme-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{styles.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-theme-text">{title}</h2>
              <p className="mt-1 text-sm text-theme-text-secondary">
                {message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-theme-text-secondary transition hover:text-theme-text"
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
