import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="text-lg font-semibold text-gray-900">Product not found</p>
      <p className="mt-1 text-sm text-gray-500">It may have been removed, or the link is wrong.</p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
      >
        Back to products
      </Link>
    </div>
  );
}
