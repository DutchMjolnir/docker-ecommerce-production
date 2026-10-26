"use client";

import { useState } from "react";
import { useCart } from "@/app/providers/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (product.stock < 1) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.stock < 1}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 ${
        compact ? "size-11" : "min-h-12 w-full px-5"
      }`}
      aria-label={compact ? `Añadir ${product.name} al carrito` : undefined}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
        {added ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
        )}
      </svg>
      {!compact && (product.stock < 1 ? "Agotado" : added ? "Añadido al carrito" : "Añadir al carrito")}
    </button>
  );
}
