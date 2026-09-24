import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function ProductCards({ products }) {
  return (
    <ul className="grid gap-3">
      {products.map((product) => (
        <li key={product.id}>
          <Link
            href={`/products/${product.id}`}
            className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded bg-gray-100 object-cover"
            />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium text-gray-900">{product.title}</p>
              <p className="capitalize text-gray-500">{product.category}</p>
              <div className="mt-1 flex justify-between tabular-nums text-gray-700">
                <span>{formatPrice(product.price)}</span>
                <span>{Number(product.rating ?? 0).toFixed(1)} ★</span>
                <span>Stock {product.stock}</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
