"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions";

const initialState = { success: false, message: "" };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">nova<span className="text-indigo-600">.</span></Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Empieza algo bueno</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Crea tu cuenta</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Guarda tus pedidos y descubre una forma más fácil de comprar.</p>
        <form action={formAction} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Nombre
            <input required minLength={2} name="name" autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Tu nombre" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Correo electrónico
            <input required type="email" name="email" autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="tu@correo.com" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Contraseña
            <input required minLength={8} type="password" name="password" autoComplete="new-password" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Mínimo 8 caracteres" />
          </label>
          {state.message && <p role="status" className={`rounded-xl px-4 py-3 text-sm leading-5 ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{state.message}</p>}
          <button disabled={pending} className="min-h-12 w-full rounded-xl bg-indigo-600 px-4 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{pending ? "Creando cuenta..." : "Crear cuenta"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">¿Ya tienes cuenta? <Link href="/login" className="font-bold text-indigo-700 hover:text-indigo-900">Inicia sesión</Link></p>
      </section>
    </main>
  );
}
