import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function getWeekStartKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export async function getVolumeAnalytics(req: Request, res: Response) {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const sets = await prisma.workoutSet.findMany({
    where: {
      completed: true,
      workout: { userId: req.userId, date: { gte: since } },
    },
    select: {
      weightKg: true,
      reps: true,
      workout: { select: { date: true } },
      exercise: { select: { muscleGroup: true } },
    },
  });

  const weeklyMap = new Map<string, number>();
  const muscleGroupMap = new Map<string, number>();

  for (const set of sets) {
    const volume = Number(set.weightKg) * set.reps;

    const weekKey = getWeekStartKey(set.workout.date);
    weeklyMap.set(weekKey, (weeklyMap.get(weekKey) ?? 0) + volume);

    const group = set.exercise.muscleGroup;
    muscleGroupMap.set(group, (muscleGroupMap.get(group) ?? 0) + volume);
  }

  const weeklyVolume = [...weeklyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, totalVolume]) => ({
      weekStart,
      totalVolume: Math.round(totalVolume * 100) / 100,
    }));

  const muscleGroupVolume = [...muscleGroupMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([muscleGroup, totalVolume]) => ({
      muscleGroup,
      totalVolume: Math.round(totalVolume * 100) / 100,
    }));

  res.json({
    sinceDate: since.toISOString().slice(0, 10),
    weeklyVolume,
    muscleGroupVolume,
  });
}
