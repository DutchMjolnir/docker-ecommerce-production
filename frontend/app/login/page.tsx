"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions";

const initialState = { success: false, message: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">nova<span className="text-indigo-600">.</span></Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Qué alegría verte</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Inicia sesión</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Accede a tus pedidos y disfruta de una experiencia a tu medida.</p>
        <form action={formAction} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Correo electrónico
            <input required type="email" name="email" autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="tu@correo.com" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Contraseña
            <input required type="password" name="password" autoComplete="current-password" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Tu contraseña" />
          </label>
          {state.message && <p role="status" className={`rounded-xl px-4 py-3 text-sm leading-5 ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{state.message}</p>}
          <button disabled={pending} className="min-h-12 w-full rounded-xl bg-indigo-600 px-4 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{pending ? "Un momento..." : "Iniciar sesión"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">¿Aún no tienes cuenta? <Link href="/register" className="font-bold text-indigo-700 hover:text-indigo-900">Crear cuenta</Link></p>
        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-slate-500 hover:text-indigo-700">← Volver a la tienda</Link>
      </section>
    </main>
  );
}
