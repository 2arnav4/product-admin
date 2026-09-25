"use client";

import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { loadDashboardStats } from "@/services/dashboardService";
import { formatPrice } from "@/lib/format";
import Spinner from "@/components/ui/Spinner";
import ErrorState from "@/components/ui/ErrorState";
import StatCard from "@/components/dashboard/StatCard";

const fetchStats = (signal) => loadDashboardStats(signal);
const numberFormatter = new Intl.NumberFormat("en-US");

export default function DashboardView() {
  const { data: stats, error, isLoading, retry } = useFetch(fetchStats);

  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (isLoading || !stats) return <Spinner />;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Earnings</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Revenue" value={formatPrice(stats.revenue)} hint="From all orders (DummyJSON carts)" />
          <StatCard label="Orders" value={numberFormatter.format(stats.orderCount)} />
          <StatCard label="Units sold" value={numberFormatter.format(stats.unitsSold)} />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Catalogue</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <StatCard label="Products" value={numberFormatter.format(stats.productCount)} />
          <StatCard label="Categories" value={numberFormatter.format(stats.categoryCount)} />
          <StatCard label="Inventory value" value={formatPrice(stats.inventoryValue)} hint="Price × stock" />
          <StatCard label="Low stock" value={numberFormatter.format(stats.lowStock.length)} hint="Fewer than 10 left" />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Low stock</h2>
          <Link href="/products" className="text-sm text-blue-700 hover:underline">
            All products →
          </Link>
        </div>
        {stats.lowStock.length === 0 ? (
          <p className="text-sm text-gray-500">Everything is well stocked.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {stats.lowStock.slice(0, 8).map((product) => (
              <li key={product.id} className="flex items-center justify-between py-2">
                <Link href={`/products/${product.id}`} className="truncate pr-4 text-gray-900 hover:underline">
                  {product.title}
                </Link>
                <span className="shrink-0 tabular-nums text-red-700">{product.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
