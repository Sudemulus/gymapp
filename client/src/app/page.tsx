import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
        Antrenmanını takip et
      </h1>
      <p className="max-w-md text-lg text-slate-400">
        Egzersiz kütüphanesine göz at veya yeni bir antrenman başlat.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/exercises"
          className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-slate-100 transition-colors hover:bg-slate-700"
        >
          Egzersizleri Gör
        </Link>
        <Link
          href="/workout"
          className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-emerald-400"
        >
          Antrenman Başlat
        </Link>
      </div>
    </div>
  );
}
