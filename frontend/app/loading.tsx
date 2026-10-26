import { Header } from "@/app/components/Header";

export default function Loading() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-5 py-12 sm:px-8">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
        <div className="mt-12 h-8 w-72 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />)}
        </div>
      </main>
    </>
  );
}
