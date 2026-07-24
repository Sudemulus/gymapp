"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkout } from "@/services/api";
import { useRequireAuth } from "@/lib/AuthProvider";
import PageHeader from "@/components/PageHeader";
import { Flame } from "lucide-react";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function StartWorkoutPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const [name, setName] = useState("Antrenman");
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const workout = await createWorkout({
        name,
        date,
        notes: notes || undefined,
      });
      router.push(`/workout/${workout.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return <p className="px-4 py-10 text-center text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <PageHeader
        icon={Flame}
        title="Yeni Antrenman"
        subtitle="Antrenman bilgilerini gir ve başlat."
      />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Antrenman Adı</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Tarih</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Not (opsiyonel)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-red-400">Hata: {error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Başlatılıyor..." : "Antrenmanı Başlat"}
        </button>
      </form>
    </div>
  );
}
