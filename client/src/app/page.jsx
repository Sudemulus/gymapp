"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import FeatureSlider from "@/components/FeatureSlider";
import { useAuth } from "@/lib/AuthProvider";
import { getWorkouts } from "@/services/api";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    getWorkouts()
      .then((workouts) => {
        if (!cancelled) setLastWorkout(workouts[0] ?? null);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user]);

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

      {!loading && user && lastWorkout && (
        <Link
          href={`/workout/${lastWorkout.id}`}
          className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition-colors hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Son Antrenmanın</p>
              <h3 className="mt-1 font-semibold text-slate-100">{lastWorkout.name}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {new Date(lastWorkout.date).toLocaleDateString("tr-TR")} ·{" "}
                {lastWorkout.sets.filter((s) => s.completed).length}/{lastWorkout.sets.length} set
                tamamlandı
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-400">
              Devam Et
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      )}

      <FeatureSlider className="mt-4 w-full" />
    </div>
  );
}
