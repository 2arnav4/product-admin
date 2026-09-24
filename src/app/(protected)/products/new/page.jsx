"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { addProduct } from "@/services/productService";
import { EMPTY_PRODUCT } from "@/lib/productValidation";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    const created = await addProduct(payload);
    router.replace(`/products/${created.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Add product</h1>
      <ProductForm
        initialValues={EMPTY_PRODUCT}
        submitLabel="Create product"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
