import { Header } from "@/app/components/Header";

export default function CheckoutLoading() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[75vh] w-full max-w-7xl px-5 py-10 sm:px-8">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mb-8 mt-3 h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
            <div className="h-56 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
        </div>
      </main>
    </>
  );
}
