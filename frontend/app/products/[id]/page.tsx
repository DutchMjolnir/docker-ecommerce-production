import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import { getProduct } from "@/lib/products";
import { formatCurrency } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) notFound();
  const product = await getProduct(productId);
  if (!product || !product.is_active) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/" className="text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
          ← Volver a la tienda
        </Link>
        <div className="mt-7 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-100">
            {product.image && (
              <div
                role="img"
                aria-label={product.name}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${product.image}")` }}
              />
            )}
            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow">
                {product.badge}
              </span>
            )}
          </div>
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
              {product.category ?? "Tecnología"}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{product.description}</p>
            <p className="mt-7 text-3xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado"}
            </p>
            <div className="mt-7 max-w-sm">
              <AddToCartButton product={product} />
            </div>
            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <p>✓ Envío gratis a partir de $50</p>
              <p>✓ Devoluciones sencillas durante 30 días</p>
              <p>✓ Compra segura y atención cercana</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
