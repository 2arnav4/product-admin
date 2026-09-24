import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  return <ProductDetail id={id} />;
}
