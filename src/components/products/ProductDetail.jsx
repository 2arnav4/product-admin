"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { loadProduct } from "@/services/productService";
import { formatPrice } from "@/lib/format";
import Spinner from "@/components/ui/Spinner";
import ErrorState from "@/components/ui/ErrorState";
import ProductNotFound from "@/components/products/ProductNotFound";
import ProductGallery from "@/components/products/ProductGallery";
import ProductReviews from "@/components/products/ProductReviews";
import DeleteProductButton from "@/components/products/DeleteProductButton";

export default function ProductDetail({ id }) {
  const fetchProduct = useCallback((signal) => loadProduct(id, signal), [id]);
  const { data: product, error, isLoading, retry } = useFetch(fetchProduct);

  if (error?.status === 404) return <ProductNotFound />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (isLoading || !product) return <Spinner />;

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <article className="space-y-8">
      <Link href="/products" className="text-sm text-gray-600 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm capitalize text-gray-500">{product.category}</p>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-gray-900">{formatPrice(product.price)}</p>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-gray-500">Rating</dt>
            <dd className="tabular-nums">{Number(product.rating ?? 0).toFixed(1)} ★</dd>
            <dt className="text-gray-500">Stock</dt>
            <dd className="tabular-nums">{product.stock}</dd>
            {product.brand && (
              <>
                <dt className="text-gray-500">Brand</dt>
                <dd>{product.brand}</dd>
              </>
            )}
          </dl>
          <p className="leading-relaxed text-gray-700">{product.description}</p>
          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Edit
            </Link>
            <DeleteProductButton product={product} />
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Reviews</h2>
        <ProductReviews reviews={product.reviews ?? []} />
      </section>
    </article>
  );
}
