export function StorageWarningBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-sm">
      Device storage is getting full. Consider exporting or clearing old sessions soon.
    </div>
  );
}
