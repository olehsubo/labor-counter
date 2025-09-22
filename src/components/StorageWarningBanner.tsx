export function StorageWarningBanner() {
  return (
    <div className="rounded-2xl border border-theme-accent-orange bg-theme-accent-orange px-4 py-3 text-sm text-theme-text shadow-sm">
      Device storage is getting full. Consider exporting or clearing old
      sessions soon.
    </div>
  );
}
