"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getWorkoutById,
  getExercises,
  addSetToWorkout,
  updateWorkoutSet,
  deleteWorkoutSet,
  getLastPerformance,
} from "@/services/api";
import { muscleGroupLabel } from "@/lib/muscleGroups";
import { useRequireAuth } from "@/lib/AuthProvider";
import RestTimer from "@/components/RestTimer";
import PageHeader from "@/components/PageHeader";
import { Flame } from "lucide-react";

export default function ActiveWorkoutPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useRequireAuth();
  const restTimerRef = useRef(null);

  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [exerciseId, setExerciseId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [reps, setReps] = useState("");
  const [setCount, setSetCount] = useState("1");
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [lastPerformance, setLastPerformance] = useState(null);
  const [lastPerformanceLoading, setLastPerformanceLoading] = useState(false);
  const [newRecord, setNewRecord] = useState(null);

  const [editingSetId, setEditingSetId] = useState(null);
  const [editSetForm, setEditSetForm] = useState(null);
  const [rowError, setRowError] = useState(null);
  const [rowBusyId, setRowBusyId] = useState(null);

  async function loadWorkout() {
    const data = await getWorkoutById(id);
    setWorkout(data);
  }

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [workoutData, exercisesData] = await Promise.all([
          getWorkoutById(id),
          getExercises(),
        ]);
        if (cancelled) return;
        setWorkout(workoutData);
        setExercises(exercisesData);
        if (exercisesData.length > 0) setExerciseId(String(exercisesData[0].id));
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
  }, [id, authLoading, user]);

  useEffect(() => {
    if (!exerciseId) return;

    let cancelled = false;

    async function loadLastPerformance() {
      setLastPerformanceLoading(true);
      setNewRecord(null);
      try {
        const data = await getLastPerformance(exerciseId);
        if (!cancelled) setLastPerformance(data);
      } catch {
        if (!cancelled) setLastPerformance(null);
      } finally {
        if (!cancelled) setLastPerformanceLoading(false);
      }
    }

    loadLastPerformance();

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  async function handleAddSet(e) {
    e.preventDefault();
    setFormError(null);

    if (!exerciseId || weightKg === "" || reps === "") {
      setFormError("Egzersiz, ağırlık ve tekrar alanları zorunlu.");
      return;
    }

    const priorRecordWeight = lastPerformance?.personalRecord?.weightKg ?? null;
    const isNewRecord =
      completed && (priorRecordWeight === null || Number(weightKg) > Number(priorRecordWeight));

    setSubmitting(true);
    try {
      // Sets are created sequentially (not in parallel) because the backend
      // assigns setNumber based on the current count for the workout —
      // parallel calls would race and could assign duplicate set numbers.
      for (let i = 0; i < Number(setCount); i++) {
        await addSetToWorkout(id, {
          exerciseId: Number(exerciseId),
          weightKg: Number(weightKg),
          reps: Number(reps),
          completed,
        });
      }
      await loadWorkout();
      const refreshed = await getLastPerformance(exerciseId);
      setLastPerformance(refreshed);
      setNewRecord(isNewRecord ? { weightKg: Number(weightKg), reps: Number(reps) } : null);
      if (completed) restTimerRef.current?.start();
      setWeightKg("");
      setReps("");
      setSetCount("1");
      setCompleted(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEditSet(set) {
    setEditingSetId(set.id);
    setEditSetForm({
      weightKg: String(set.weightKg),
      reps: String(set.reps),
      completed: set.completed,
    });
    setRowError(null);
  }

  function cancelEditSet() {
    setEditingSetId(null);
    setEditSetForm(null);
    setRowError(null);
  }

  async function saveEditSet(setId) {
    if (editSetForm.weightKg === "" || editSetForm.reps === "") {
      setRowError("Ağırlık ve tekrar zorunlu.");
      return;
    }

    setRowBusyId(setId);
    setRowError(null);
    try {
      await updateWorkoutSet(setId, {
        weightKg: Number(editSetForm.weightKg),
        reps: Number(editSetForm.reps),
        completed: editSetForm.completed,
      });
      await loadWorkout();
      cancelEditSet();
    } catch (err) {
      setRowError(err.message);
    } finally {
      setRowBusyId(null);
    }
  }

  async function handleDeleteSet(setId) {
    if (!window.confirm("Bu seti silmek istediğine emin misin?")) return;

    setRowBusyId(setId);
    try {
      await deleteWorkoutSet(setId);
      await loadWorkout();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setRowBusyId(null);
    }
  }

  if (loading) {
    return <p className="px-4 py-10 text-center text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="px-4 py-10 text-center text-red-400">Hata: {error}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        icon={Flame}
        title={workout.name}
        subtitle={`${new Date(workout.date).toLocaleDateString("tr-TR")}${
          workout.notes ? ` · ${workout.notes}` : ""
        }`}
      />

      <div className="mt-6">
        <RestTimer ref={restTimerRef} />
      </div>

      <form
        onSubmit={handleAddSet}
        className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-4"
      >
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Egzersiz</span>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name} ({muscleGroupLabel(exercise.muscleGroup)})
              </option>
            ))}
          </select>
        </label>

        {!lastPerformanceLoading && lastPerformance?.sets.length > 0 && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 sm:col-span-2 sm:self-end">
            <span className="font-medium">Geçen Seferki Performansın: </span>
            {lastPerformance.sets
              .map((s) => `${s.weightKg} kg × ${s.reps} tekrar`)
              .join(", ")}
          </div>
        )}

        {!lastPerformanceLoading && lastPerformance?.personalRecord && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 sm:col-span-2 sm:self-end">
            <span className="font-medium">🏆 Kişisel Rekorun: </span>
            {lastPerformance.personalRecord.weightKg} kg × {lastPerformance.personalRecord.reps}{" "}
            tekrar
          </div>
        )}

        {newRecord && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-300 sm:col-span-4">
            🏆 Yeni Rekor! {newRecord.weightKg} kg × {newRecord.reps} tekrar
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Ağırlık (kg)</span>
          <input
            type="number"
            step="0.5"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Tekrar</span>
          <input
            type="number"
            min="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Set Sayısı</span>
          <select
            value={setCount}
            onChange={(e) => setSetCount(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-slate-300">Tamamlandı</span>
        </label>

        {formError && (
          <p className="text-sm text-red-400 sm:col-span-4">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting || exercises.length === 0}
          className="rounded-lg bg-emerald-500 px-6 py-2.5 font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-4"
        >
          {submitting
            ? "Kaydediliyor..."
            : Number(setCount) > 1
              ? `${setCount} Set Kaydet`
              : "Seti Kaydet"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100">Setler</h2>

        {workout.sets.length === 0 ? (
          <p className="mt-2 text-slate-400">Henüz set eklenmedi.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Set</th>
                  <th className="px-4 py-3 font-medium">Egzersiz</th>
                  <th className="px-4 py-3 font-medium">Ağırlık (kg)</th>
                  <th className="px-4 py-3 font-medium">Tekrar</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {workout.sets.map((set) => {
                  const isEditing = editingSetId === set.id;
                  const isBusy = rowBusyId === set.id;

                  if (isEditing) {
                    return (
                      <tr key={set.id} className="bg-slate-900/50">
                        <td className="px-4 py-2 text-slate-300">{set.setNumber}</td>
                        <td className="px-4 py-2 text-slate-100">{set.exercise.name}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.5"
                            value={editSetForm.weightKg}
                            onChange={(e) =>
                              setEditSetForm({ ...editSetForm, weightKg: e.target.value })
                            }
                            className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={editSetForm.reps}
                            onChange={(e) =>
                              setEditSetForm({ ...editSetForm, reps: e.target.value })
                            }
                            className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={editSetForm.completed}
                              onChange={(e) =>
                                setEditSetForm({ ...editSetForm, completed: e.target.checked })
                              }
                              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="text-xs text-slate-400">Tamamlandı</span>
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEditSet(set.id)}
                                disabled={isBusy}
                                className="rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={cancelEditSet}
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
                    <tr key={set.id}>
                      <td className="px-4 py-3 text-slate-300">{set.setNumber}</td>
                      <td className="px-4 py-3 text-slate-100">{set.exercise.name}</td>
                      <td className="px-4 py-3 text-slate-300">{set.weightKg}</td>
                      <td className="px-4 py-3 text-slate-300">{set.reps}</td>
                      <td className="px-4 py-3">
                        {set.completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            ✓ Tamamlandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                            Bekliyor
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditSet(set)}
                            className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteSet(set.id)}
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
