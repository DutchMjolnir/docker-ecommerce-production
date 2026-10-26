"use client";

import Link from "next/link";
import { Header } from "@/app/components/Header";
import { useCart } from "@/app/providers/CartProvider";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[75vh] w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Tu selección</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Tu carrito</h1>
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
            <span className="flex size-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-9 fill-none stroke-current" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </span>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">Tu carrito está esperando</h2>
            <p className="mt-2 max-w-sm leading-6 text-slate-500">
              Todavía no has añadido nada. Encuentra algo que te guste y lo guardaremos aquí.
            </p>
            <Link href="/" className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
              {items.map(({ product, quantity }) => (
                <article key={product.id} className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap">
                  <Link
                    href={`/products/${product.id}`}
                    className="size-24 shrink-0 rounded-xl bg-cover bg-center bg-indigo-50"
                    style={product.image ? { backgroundImage: `url("${product.image}")` } : undefined}
                    aria-label={`Ver ${product.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{product.category}</p>
                    <Link href={`/products/${product.id}`} className="mt-1 block truncate font-bold text-slate-900 hover:text-indigo-700">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center rounded-xl border border-slate-200">
                    <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} className="size-10 text-lg text-slate-600 hover:text-indigo-700" aria-label={`Quitar una unidad de ${product.name}`}>−</button>
                    <span className="min-w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} className="size-10 text-lg text-slate-600 hover:text-indigo-700 disabled:text-slate-300" aria-label={`Añadir una unidad de ${product.name}`}>+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(product.id)} className="rounded-lg p-2 text-sm font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Eliminar ${product.name}`}>Eliminar</button>
                </article>
              ))}
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">Resumen del pedido</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-600">
                <span>Envío</span><span className="font-semibold text-emerald-700">{subtotal >= 50 ? "Gratis" : formatCurrency(4.9)}</span>
              </div>
              <div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-base font-extrabold text-slate-900">
                <span>Total</span><span>{formatCurrency(subtotal + (subtotal >= 50 ? 0 : 4.9))}</span>
              </div>
              <Link href="/checkout" className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700">
                Continuar al pago
              </Link>
              <p className="mt-4 text-center text-xs text-slate-500">Pago seguro · Devoluciones fáciles</p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
