"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/AuthProvider";
import { getVolumeAnalytics, getWorkouts } from "@/services/api";
import VolumeLineChart from "@/components/VolumeLineChart";
import MuscleGroupDonutChart from "@/components/MuscleGroupDonutChart";
import PageHeader from "@/components/PageHeader";
import { LayoutDashboard } from "lucide-react";

const RECENT_WORKOUTS_LIMIT = 5;

function formatVolume(value) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(value));
}

function workoutVolume(workout) {
  return workout.sets
    .filter((set) => set.completed)
    .reduce((sum, set) => sum + Number(set.weightKg) * set.reps, 0);
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [analytics, setAnalytics] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [analyticsData, workoutsData] = await Promise.all([
          getVolumeAnalytics(),
          getWorkouts(),
        ]);
        if (cancelled) return;
        setAnalytics(analyticsData);
        setWorkouts(workoutsData);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading || loading) {
    return <p className="px-4 py-10 text-center text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="px-4 py-10 text-center text-red-400">Hata: {error}</p>;
  }

  const recentWorkouts = workouts.slice(0, RECENT_WORKOUTS_LIMIT);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader icon={LayoutDashboard} title="Dashboard" subtitle="Son 30 günlük ilerlemen." />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Haftalık Toplam Hacim</h2>
          <p className="text-sm text-slate-400">Ağırlık × tekrar toplamı (kg)</p>
          <div className="mt-4">
            <VolumeLineChart data={analytics?.weeklyVolume} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Kas Grubu Dağılımı</h2>
          <p className="text-sm text-slate-400">Hangi kas grubuna ne kadar hacim verdin</p>
          <div className="mt-4">
            <MuscleGroupDonutChart data={analytics?.muscleGroupVolume} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100">Son Antrenmanlar</h2>

        {recentWorkouts.length === 0 ? (
          <p className="mt-2 text-slate-400">Henüz bir antrenman kaydın yok.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentWorkouts.map((workout) => {
              const completedSets = workout.sets.filter((s) => s.completed).length;
              return (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700"
                >
                  <h3 className="font-semibold text-slate-100">{workout.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(workout.date).toLocaleDateString("tr-TR")}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {completedSets}/{workout.sets.length} set tamamlandı
                    </span>
                    <span className="font-medium text-emerald-400">
                      {formatVolume(workoutVolume(workout))} kg
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
