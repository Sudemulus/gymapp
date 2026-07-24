"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/AuthProvider";
import {
  getBodyStats,
  createBodyStat,
  updateBodyStat,
  deleteBodyStat,
} from "@/services/api";
import WeightLineChart from "@/components/WeightLineChart";
import BodyMeasurementsLineChart from "@/components/BodyMeasurementsLineChart";
import PageHeader from "@/components/PageHeader";
import { Ruler } from "lucide-react";

const OPTIONAL_FIELDS = ["chest", "waist", "biceps", "thigh"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toNumberOrNull(value) {
  return value === "" || value === undefined || value === null ? null : Number(value);
}

function emptyForm() {
  return { weight: "", chest: "", waist: "", biceps: "", thigh: "", date: today() };
}

function statToFormValues(stat) {
  return {
    weight: String(stat.weight),
    chest: stat.chest === null ? "" : String(stat.chest),
    waist: stat.waist === null ? "" : String(stat.waist),
    biceps: stat.biceps === null ? "" : String(stat.biceps),
    thigh: stat.thigh === null ? "" : String(stat.thigh),
    date: stat.date.slice(0, 10),
  };
}

function buildPayload(form) {
  return {
    weight: Number(form.weight),
    chest: toNumberOrNull(form.chest),
    waist: toNumberOrNull(form.waist),
    biceps: toNumberOrNull(form.biceps),
    thigh: toNumberOrNull(form.thigh),
    date: form.date,
  };
}

export default function BodyStatsPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [rowError, setRowError] = useState(null);
  const [rowBusyId, setRowBusyId] = useState(null);

  async function loadStats() {
    const data = await getBodyStats();
    setStats(data);
  }

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBodyStats();
        if (!cancelled) setStats(data);
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

  async function handleAddSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (form.weight === "" || !form.date) {
      setFormError("Kilo ve tarih zorunlu.");
      return;
    }

    setSubmitting(true);
    try {
      await createBodyStat(buildPayload(form));
      await loadStats();
      setForm(emptyForm());
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(stat) {
    setEditingId(stat.id);
    setEditForm(statToFormValues(stat));
    setRowError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setRowError(null);
  }

  async function saveEdit(id) {
    if (editForm.weight === "" || !editForm.date) {
      setRowError("Kilo ve tarih zorunlu.");
      return;
    }

    setRowBusyId(id);
    setRowError(null);
    try {
      await updateBodyStat(id, buildPayload(editForm));
      await loadStats();
      cancelEdit();
    } catch (err) {
      setRowError(err.message);
    } finally {
      setRowBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Bu ölçü kaydını silmek istediğine emin misin?")) return;

    setRowBusyId(id);
    try {
      await deleteBodyStat(id);
      await loadStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setRowBusyId(null);
    }
  }

  if (authLoading || loading) {
    return <p className="px-4 py-10 text-center text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="px-4 py-10 text-center text-red-400">Hata: {error}</p>;
  }

  const chartData = stats.map((s) => ({
    date: s.date,
    weight: Number(s.weight),
    chest: s.chest === null ? null : Number(s.chest),
    waist: s.waist === null ? null : Number(s.waist),
    biceps: s.biceps === null ? null : Number(s.biceps),
    thigh: s.thigh === null ? null : Number(s.thigh),
  }));

  const sortedDesc = [...stats].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        icon={Ruler}
        title="Ölçülerim"
        subtitle="Kilo ve vücut ölçülerindeki değişimi takip et."
      />

      <form
        onSubmit={handleAddSubmit}
        className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-3 lg:grid-cols-6"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Kilo (kg)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Göğüs (cm)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.chest}
            onChange={(e) => setForm({ ...form, chest: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Bel (cm)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.waist}
            onChange={(e) => setForm({ ...form, waist: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Kol (cm)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.biceps}
            onChange={(e) => setForm({ ...form, biceps: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Uyluk (cm)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.thigh}
            onChange={(e) => setForm({ ...form, thigh: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Tarih</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        {formError && <p className="col-span-2 text-sm text-red-400 sm:col-span-3 lg:col-span-6">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="col-span-2 rounded-lg bg-emerald-500 px-6 py-2.5 font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-3 lg:col-span-6"
        >
          {submitting ? "Kaydediliyor..." : "Ölçü Ekle"}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Kilo Değişimi</h2>
          <div className="mt-4">
            <WeightLineChart data={chartData} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Vücut Ölçüleri</h2>
          <div className="mt-4">
            <BodyMeasurementsLineChart data={chartData} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100">Geçmiş Kayıtlar</h2>

        {sortedDesc.length === 0 ? (
          <p className="mt-2 text-slate-400">Henüz bir ölçü kaydın yok.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                  <th className="px-4 py-3 font-medium">Kilo</th>
                  <th className="px-4 py-3 font-medium">Göğüs</th>
                  <th className="px-4 py-3 font-medium">Bel</th>
                  <th className="px-4 py-3 font-medium">Kol</th>
                  <th className="px-4 py-3 font-medium">Uyluk</th>
                  <th className="px-4 py-3 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {sortedDesc.map((stat) => {
                  const isEditing = editingId === stat.id;
                  const isBusy = rowBusyId === stat.id;

                  if (isEditing) {
                    return (
                      <tr key={stat.id} className="bg-slate-900/50">
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-36 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.weight}
                            onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                            className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        {OPTIONAL_FIELDS.map((field) => (
                          <td key={field} className="px-4 py-2">
                            <input
                              type="number"
                              step="0.1"
                              value={editForm[field]}
                              onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                              className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(stat.id)}
                                disabled={isBusy}
                                className="rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
                              >
                                İptal
                              </button>
                            </div>
                            {rowError && <p className="text-xs text-red-400">{rowError}</p>}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={stat.id}>
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(stat.date).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-slate-100">{stat.weight} kg</td>
                      <td className="px-4 py-3 text-slate-300">{stat.chest ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-300">{stat.waist ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-300">{stat.biceps ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-300">{stat.thigh ?? "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(stat)}
                            className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(stat.id)}
                            disabled={isBusy}
                            className="rounded-md bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-60"
                          >
                            {isBusy ? "..." : "Sil"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
