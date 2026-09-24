export default function EmptyState({ title, hint }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="font-medium text-gray-900">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
