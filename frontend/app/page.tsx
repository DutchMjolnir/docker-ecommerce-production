import { Suspense } from "react";
import { ProductCatalog } from "@/app/components/ProductCatalog";
import { Header } from "@/app/components/Header";

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando productos">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-slate-950">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_0%,rgba(99,102,241,0.45),transparent_36%),radial-gradient(ellipse_at_20%_100%,rgba(124,58,237,0.28),transparent_35%)]" />
          <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-300/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-200">
                <span className="size-1.5 rounded-full bg-violet-300" />
                Tecnología para tu día a día
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Lo que te mueve,
                <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  empieza aquí.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Encuentra tecnología que encaja contigo. Selección cuidada, precios honestos y envío gratis en tu primer pedido.
              </p>
              <a href="#productos" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-50">
                Descubrir productos
                <span aria-hidden="true" className="ml-2">→</span>
              </a>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-xs font-medium text-slate-300">
                <span>✓ Envío gratuito desde $50</span>
                <span>✓ Devolución fácil durante 30 días</span>
              </div>
            </div>
            <div className="relative hidden h-[330px] md:block">
              <div className="absolute right-8 top-6 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute right-5 top-0 flex h-72 w-72 rotate-3 items-center justify-center rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/15 to-white/[0.03] shadow-2xl shadow-indigo-950/50 backdrop-blur">
                <div className="flex size-52 -rotate-3 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-indigo-400 via-indigo-600 to-violet-700 shadow-2xl shadow-indigo-950/60">
                  <svg aria-hidden="true" viewBox="0 0 120 120" className="size-36 fill-none stroke-white/90" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M35 73V54a25 25 0 0 1 50 0v19m-50-7h15v25H35a8 8 0 0 1-8-8v-9a8 8 0 0 1 8-8Zm50 0H70v25h15a8 8 0 0 0 8-8v-9a8 8 0 0 0-8-8Z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-0 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-xs font-medium text-slate-400">Selección de la semana</p>
                <p className="mt-1 font-bold text-white">Studio Pro · Audio</p>
              </div>
            </div>
          </div>
        </section>

        <section id="productos" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Hechos para ti</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Descubre la selección</h2>
              <p className="mt-2 text-slate-500">Tecnología útil, diseño cuidado y buenos precios.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600">Novedades y favoritos</span>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductCatalog />
          </Suspense>
        </section>
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:grid-cols-3 sm:px-8">
            {[
              ["Envío rápido", "Tu pedido, en la puerta de casa en 24–48 h."],
              ["Compra segura", "Tus datos siempre protegidos y bajo control."],
              ["Estamos contigo", "Atención cercana cuando más la necesitas."],
            ].map(([title, description]) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">✓</span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-slate-950 px-5 py-8 text-center text-sm text-slate-400">
        <span className="font-bold text-white">nova.</span> · Tecnología que va contigo.
      </footer>
    </>
  );
}
