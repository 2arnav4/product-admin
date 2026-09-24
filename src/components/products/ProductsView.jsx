"use client";

import { useCallback, useEffect } from "react";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useFetch } from "@/hooks/useFetch";
import { getProducts } from "@/api/productsApi";
import { getTotalPages } from "@/lib/pagination";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ProductTable from "@/components/products/ProductTable";
import ProductCards from "@/components/products/ProductCards";
import Pagination from "@/components/products/Pagination";
import Filters from "@/components/products/Filters";

export default function ProductsView() {
  const { query, updateQuery } = useProductQuery();
  const fetchProducts = useCallback((signal) => getProducts(query, { signal }), [query]);
  const { data, error, isLoading, retry } = useFetch(fetchProducts);

  const totalPages = data ? getTotalPages(data.total, query.pageSize) : null;
  const isPageOutOfRange = !isLoading && totalPages !== null && query.page > totalPages;

  useEffect(() => {
    if (isPageOutOfRange) updateQuery({ page: totalPages }, { replace: true });
  }, [isPageOutOfRange, totalPages, updateQuery]);

  return (
    <div className="space-y-4">
      <Filters query={query} updateQuery={updateQuery} />
      <ProductResults
        data={data}
        error={error}
        isLoading={isLoading}
        isPageOutOfRange={isPageOutOfRange}
        retry={retry}
        query={query}
        updateQuery={updateQuery}
      />
    </div>
  );
}

function ProductResults({ data, error, isLoading, isPageOutOfRange, retry, query, updateQuery }) {
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!data || isPageOutOfRange) return <Spinner />;

  if (data.products.length === 0) {
    return <EmptyState title="No products found" hint="Try a different search or category." />;
  }

  return (
    <div className="space-y-4">
      <div className={isLoading ? "pointer-events-none opacity-50 transition-opacity" : "transition-opacity"}>
        <div className="hidden md:block">
          <ProductTable products={data.products} />
        </div>
        <div className="md:hidden">
          <ProductCards products={data.products} />
        </div>
      </div>
      <Pagination
        page={query.page}
        pageSize={query.pageSize}
        total={data.total}
        onPageChange={(page) => updateQuery({ page })}
        onPageSizeChange={(pageSize) => updateQuery({ pageSize })}
      />
    </div>
  );
}
