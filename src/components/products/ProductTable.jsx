import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function ProductTable({ products }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
        <tr>
          <th className="py-2 pr-4">Product</th>
          <th className="py-2 pr-4">Category</th>
          <th className="py-2 pr-4 text-right">Price</th>
          <th className="py-2 pr-4 text-right">Rating</th>
          <th className="py-2 text-right">Stock</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product.id}>
            <td className="py-2 pr-4">
              <Link href={`/products/${product.id}`} className="flex items-center gap-3 hover:underline">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded bg-gray-100 object-cover"
                />
                <span className="font-medium text-gray-900">{product.title}</span>
              </Link>
            </td>
            <td className="py-2 pr-4 capitalize text-gray-600">{product.category}</td>
            <td className="py-2 pr-4 text-right tabular-nums">{formatPrice(product.price)}</td>
            <td className="py-2 pr-4 text-right tabular-nums">{product.rating.toFixed(1)} ★</td>
            <td className="py-2 text-right tabular-nums">{product.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
