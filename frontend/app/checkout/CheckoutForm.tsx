"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { createOrderAction } from "@/app/actions";
import { useCart } from "@/app/providers/CartProvider";
import { formatCurrency } from "@/lib/format";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState("");
  const total = subtotal + (subtotal >= 50 || subtotal === 0 ? 0 : 4.9);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const orderItems = items.map(({ product, quantity }) => ({
      product_id: product.id,
      quantity,
    }));
    startTransition(async () => {
      const result = await createOrderAction(orderItems);
      if (result.success) {
        clearCart();
        setConfirmation(result.message);
      } else {
        setConfirmation(result.message);
      }
    });
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white px-6 py-12 text-center shadow-xl shadow-emerald-100/50 sm:px-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">✓</span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Compra confirmada</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">¡Gracias por tu pedido!</h1>
        <p className="mt-3 leading-7 text-slate-600">{confirmation}</p>
        <p className="mt-2 text-sm text-slate-500">En una tienda conectada recibirías aquí la confirmación del envío.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Seguir comprando</Link>
          <Link href="/orders" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Ver mis pedidos</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-slate-500">Añade algún producto antes de continuar con tu compra.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Explorar productos</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Datos de contacto</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Correo electrónico
              <input required type="email" autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="tu@correo.com" />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Nombre completo
              <input required minLength={2} autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Nombre y apellidos" />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Dirección de envío</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Dirección
              <input required autoComplete="street-address" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Calle, número, piso" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Código postal
              <input required autoComplete="postal-code" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="28001" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Ciudad
              <input required autoComplete="address-level2" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Madrid" />
            </label>
          </div>
        </section>
        <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-900">
          <span className="font-bold">Modo demostración:</span> el formulario confirma la compra localmente. Conecta el servicio API para guardar pedidos reales.
        </div>
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Tu pedido</h2>
        <div className="mt-5 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between gap-3 text-sm">
              <span className="text-slate-600">{product.name} <span className="text-slate-400">× {quantity}</span></span>
              <span className="shrink-0 font-semibold text-slate-800">{formatCurrency(Number(product.price) * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-slate-200 pt-4 text-sm text-slate-600"><span>Envío</span><span>{subtotal >= 50 ? "Gratis" : formatCurrency(4.9)}</span></div>
        <div className="mt-4 flex justify-between text-base font-extrabold text-slate-900"><span>Total</span><span>{formatCurrency(total)}</span></div>
        <button disabled={pending} className="mt-6 min-h-12 w-full rounded-xl bg-indigo-600 px-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {pending ? "Confirmando..." : "Confirmar compra"}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-slate-500">Al confirmar aceptas las condiciones de compra. No se realizará ningún cargo en modo demostración.</p>
      </aside>
    </form>
  );
}
