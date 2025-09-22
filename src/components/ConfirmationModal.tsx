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
            "rounded-full border border-[#FFE4D1] bg-[#FFE4D1] px-4 py-2 text-sm font-semibold text-[#333333] shadow-sm transition hover:bg-[#FFD4B8]",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#666666] transition hover:text-[#333333]",
        };
      case "danger":
        return {
          icon: "🗑️",
          confirmButton:
            "rounded-full border border-[#FADADD] bg-[#FADADD] px-4 py-2 text-sm font-semibold text-[#333333] shadow-sm transition hover:bg-[#F7C5CA]",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#666666] transition hover:text-[#333333]",
        };
      default:
        return {
          icon: "❓",
          confirmButton:
            "rounded-full border border-[#CFE5D6] bg-[#CFE5D6] px-4 py-2 text-sm font-semibold text-[#333333] shadow-sm transition hover:bg-[#B8D9C4]",
          cancelButton:
            "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#666666] transition hover:text-[#333333]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333333]/20 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-[#F8F3ED] p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{styles.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-[#333333]">{title}</h2>
              <p className="mt-1 text-sm text-[#666666]">{message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-transparent px-2 py-1 text-sm text-[#999999] transition hover:text-[#333333]"
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
