"use client";

import { useEffect, useState } from "react";
import { getExercises } from "@/services/api";
import { MUSCLE_GROUPS, muscleGroupLabel } from "@/lib/muscleGroups";
import { MUSCLE_GROUP_COLORS, OTHER_COLOR } from "@/lib/muscleGroupColors";
import MuscleGroupIcon from "@/components/MuscleGroupIcon";

export default function ExercisesPage() {
  const [activeGroup, setActiveGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getExercises(activeGroup ?? undefined);
        if (!cancelled) setExercises(data);
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
  }, [activeGroup]);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-50">Egzersiz Kütüphanesi</h1>
      <p className="mt-1 text-slate-400">Kas grubuna göre filtrele veya isimle ara.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Egzersiz ara..."
        className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeGroup === null
              ? "bg-emerald-500 text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Tümü
        </button>
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group.value}
            onClick={() => setActiveGroup(group.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeGroup === group.value
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading && <p className="text-slate-400">Yükleniyor...</p>}
        {error && <p className="text-red-400">Hata: {error}</p>}
        {!loading && !error && filteredExercises.length === 0 && (
          <p className="text-slate-400">Eşleşen egzersiz bulunamadı.</p>
        )}

        {!loading && !error && filteredExercises.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const color = MUSCLE_GROUP_COLORS[exercise.muscleGroup] ?? OTHER_COLOR;
              const showImage = exercise.imageUrl && !brokenImageIds.has(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-colors hover:border-slate-700"
                >
                  {showImage ? (
                    <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2">
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="h-full w-full object-contain"
                        onError={() =>
                          setBrokenImageIds((prev) => new Set(prev).add(exercise.id))
                        }
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      <MuscleGroupIcon muscleGroup={exercise.muscleGroup} className="h-9 w-9" />
                    </div>
                  )}

                  <div className="mt-4 flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-slate-100">{exercise.name}</h2>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      {muscleGroupLabel(exercise.muscleGroup)}
                    </span>
                  </div>
                  {exercise.description && (
                    <p className="mt-2 text-sm text-slate-400">{exercise.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-10 text-xs text-slate-500">
        Bazı egzersiz görselleri{" "}
        <a
          href="https://www.exercisedb.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-400"
        >
          exercisedb.dev
        </a>{" "}
        açık egzersiz veritabanından alınmıştır.
      </p>
    </div>
  );
}
