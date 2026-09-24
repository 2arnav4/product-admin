import { Suspense } from "react";
import ProductsView from "@/components/products/ProductsView";
import Spinner from "@/components/ui/Spinner";

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Products</h1>
      <Suspense fallback={<Spinner />}>
        <ProductsView />
      </Suspense>
    </div>
  );
}
