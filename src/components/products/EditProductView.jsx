"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { editProduct, loadProduct } from "@/services/productService";
import { toFormValues } from "@/lib/productValidation";
import Spinner from "@/components/ui/Spinner";
import ErrorState from "@/components/ui/ErrorState";
import ProductNotFound from "@/components/products/ProductNotFound";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductView({ id }) {
  const router = useRouter();
  const fetchProduct = useCallback((signal) => loadProduct(id, signal), [id]);
  const { data: product, error, isLoading, retry } = useFetch(fetchProduct);

  if (error?.status === 404) return <ProductNotFound />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (isLoading || !product) return <Spinner />;

  const handleSubmit = async (payload) => {
    await editProduct(id, payload);
    router.replace(`/products/${id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit product</h1>
      <ProductForm
        initialValues={toFormValues(product)}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
