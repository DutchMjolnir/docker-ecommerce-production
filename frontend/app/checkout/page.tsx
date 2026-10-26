import { Header } from "@/app/components/Header";
import { CheckoutForm } from "@/app/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[75vh] w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Ya casi es tuyo</p>
        <h1 className="mb-8 mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Finalizar compra</h1>
        <CheckoutForm />
      </main>
    </>
  );
}
