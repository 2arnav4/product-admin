import { notFound } from "next/navigation";
import EditProductView from "@/components/products/EditProductView";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  return <EditProductView id={id} />;
}
