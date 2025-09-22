export function StorageWarningBanner() {
  return (
    <div className="rounded-2xl border border-[#FFE4D1] bg-[#FFE4D1] px-4 py-3 text-sm text-[#333333] shadow-sm">
      Device storage is getting full. Consider exporting or clearing old
      sessions soon.
    </div>
  );
}
