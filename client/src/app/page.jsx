"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import FeatureSlider from "@/components/FeatureSlider";
import { useAuth } from "@/lib/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6">
      <Logo className="h-20 w-20 rounded-3xl" />
      <div>
        <p className="text-xl font-extrabold tracking-tight text-slate-50 sm:text-2xl">
          Track<span className="text-emerald-400">Gym</span>
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
          {!loading && user ? `Tekrar hoş geldin, ${firstName}!` : "Antrenmanını takip et"}
        </h1>
      </div>
      <p className="max-w-md text-lg text-slate-400">
        {!loading && user
          ? "Bugün nereden başlamak istersin?"
          : "Egzersiz kütüphanesine göz at veya yeni bir antrenman başlat."}
      </p>

      {!loading && user ? (
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
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/exercises"
            className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-slate-100 transition-colors hover:bg-slate-700"
          >
            Egzersizleri Gör
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Ücretsiz Başla
          </Link>
        </div>
      )}

      <FeatureSlider className="mt-4 w-full" />
    </div>
  );
}
