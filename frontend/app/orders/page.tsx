import Link from "next/link";
import { cookies } from "next/headers";
import { Header } from "@/app/components/Header";
import type { ApiResponse, Order } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

async function getOrders(token: string): Promise<Order[] | null> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const result = (await response.json()) as ApiResponse<Order[]>;
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export default async function OrdersPage() {
  const token = (await cookies()).get("auth_token")?.value;
  const orders = token ? await getOrders(token) : null;

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[75vh] w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Tu cuenta</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Mis pedidos</h1>
        {!token ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-700">⌑</span>
            <h2 className="mt-5 text-xl font-bold text-slate-900">Tus compras, siempre a mano</h2>
            <p className="mx-auto mt-2 max-w-md leading-6 text-slate-500">Inicia sesión para consultar el historial y el estado de tus pedidos.</p>
            <Link href="/login" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Iniciar sesión</Link>
          </div>
        ) : orders === null ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-slate-900">El historial no está disponible</h2>
            <p className="mx-auto mt-2 max-w-md leading-6 text-slate-500">No hemos podido conectar con el servicio de pedidos. Inténtalo de nuevo más tarde.</p>
            <Link href="/" className="mt-6 inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Volver a la tienda</Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-slate-900">Aún no tienes pedidos</h2>
            <p className="mt-2 text-slate-500">Cuando hagas tu primera compra, la encontrarás aquí.</p>
            <Link href="/" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Explorar productos</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div>
                  <h2 className="font-bold text-slate-900">Pedido #{order.id}</h2>
                  <p className="mt-1 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString("es")}</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-700">{order.status}</span>
                <p className="font-extrabold text-slate-900">{formatCurrency(order.total)}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
