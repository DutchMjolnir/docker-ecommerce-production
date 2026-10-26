"use client";

import Link from "next/link";
import { useCart } from "@/app/providers/CartProvider";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Nova, inicio" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
            n
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            nova<span className="text-indigo-600">.</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          <Link className="text-sm font-semibold text-slate-600 transition hover:text-indigo-700" href="/">
            Tienda
          </Link>
          <Link className="text-sm font-semibold text-slate-600 transition hover:text-indigo-700" href="/orders">
            Mis pedidos
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
            aria-label={`Carrito, ${itemCount} productos`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" fill="currentColor" />
              <circle cx="18" cy="20" r="1" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold leading-5 text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
