"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { removeProduct } from "@/services/productService";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteProductButton({ product }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const deletingRef = useRef(false);

  const handleConfirm = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setIsDeleting(true);
    setError("");

    try {
      await removeProduct(product.id);
      router.replace("/products");
    } catch (err) {
      setError(err.message);
      deletingRef.current = false;
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setError("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
      {isOpen && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${product.title}" will be removed from the list.`}
          confirmLabel="Delete"
          isBusy={isDeleting}
          error={error}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
