import { Suspense } from "react";
import Link from "next/link";
import ProductsView from "@/components/products/ProductsView";
import Spinner from "@/components/ui/Spinner";

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add product
        </Link>
      </div>
      <Suspense fallback={<Spinner />}>
        <ProductsView />
      </Suspense>
    </div>
  );
}
