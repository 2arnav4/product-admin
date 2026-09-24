export default function Spinner({ label = "Loading…" }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-sm text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      {label}
    </div>
  );
}
