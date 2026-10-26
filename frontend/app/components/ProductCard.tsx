import Link from "next/link";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-200/70">
      <Link
        href={`/products/${product.id}`}
        aria-label={`Ver ${product.name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-100"
      >
        {product.image && (
          <div
            role="img"
            aria-label={product.name}
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${product.image}")` }}
          />
        )}
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">
          {product.category ?? "Tecnología"}
        </p>
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="truncate text-lg font-bold text-slate-900 transition hover:text-indigo-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(product.price)}
          </span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
