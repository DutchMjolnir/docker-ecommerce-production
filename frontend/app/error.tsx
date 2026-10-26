"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error de renderizado en la tienda.", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-700">!</span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Algo no ha salido bien</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">No hemos podido cargar esta página</h1>
        <p className="mt-3 leading-6 text-slate-500">Prueba de nuevo. Si el problema continúa, vuelve más tarde.</p>
        <button type="button" onClick={() => reset()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Intentar de nuevo</button>
      </div>
    </main>
  );
}
