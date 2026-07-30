import { Request, Response } from "express";
import { MuscleGroup } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function getExercises(req: Request, res: Response) {
  const { muscleGroup } = req.query;

  if (muscleGroup && !Object.values(MuscleGroup).includes(muscleGroup as MuscleGroup)) {
    return res.status(400).json({
      error: `Invalid muscleGroup. Allowed values: ${Object.values(MuscleGroup).join(", ")}`,
    });
  }

  const exercises = await prisma.exercise.findMany({
    where: muscleGroup ? { muscleGroup: muscleGroup as MuscleGroup } : undefined,
  });
  res.json(exercises);
}

export async function getExerciseById(req: Request, res: Response) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!exercise) return res.status(404).json({ error: "Exercise not found" });
  res.json(exercise);
}

export async function getLastPerformance(req: Request, res: Response) {
  const exerciseId = Number(req.params.id);

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return res.status(404).json({ error: "Exercise not found" });

  const [lastCompletedSet, personalRecordSet] = await Promise.all([
    prisma.workoutSet.findFirst({
      where: { exerciseId, completed: true, workout: { userId: req.userId } },
      orderBy: [{ workout: { date: "desc" } }, { createdAt: "desc" }],
      select: { workoutId: true },
    }),
    prisma.workoutSet.findFirst({
      where: { exerciseId, completed: true, workout: { userId: req.userId } },
      orderBy: [{ weightKg: "desc" }, { reps: "desc" }],
      select: { weightKg: true, reps: true, workout: { select: { date: true } } },
    }),
  ]);

  const personalRecord = personalRecordSet
    ? {
        weightKg: personalRecordSet.weightKg,
        reps: personalRecordSet.reps,
        date: personalRecordSet.workout.date,
      }
    : null;

  if (!lastCompletedSet) {
    return res.json({ workoutId: null, date: null, sets: [], personalRecord });
  }

  const [workout, sets] = await Promise.all([
    prisma.workout.findUnique({
      where: { id: lastCompletedSet.workoutId },
      select: { date: true },
    }),
    prisma.workoutSet.findMany({
      where: { workoutId: lastCompletedSet.workoutId, exerciseId },
      orderBy: { setNumber: "asc" },
      select: { setNumber: true, weightKg: true, reps: true, completed: true },
    }),
  ]);

  res.json({
    workoutId: lastCompletedSet.workoutId,
    date: workout?.date ?? null,
    sets,
    personalRecord,
  });
}

export async function createExercise(req: Request, res: Response) {
  const { name, muscleGroup, description } = req.body;
  if (!name || !muscleGroup) {
    return res.status(400).json({ error: "name and muscleGroup are required" });
  }

  try {
    const exercise = await prisma.exercise.create({
      data: { name, muscleGroup, description },
    });
    res.status(201).json(exercise);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "An exercise with this name already exists" });
    }
    if (err.code === "P2009" || err.name === "PrismaClientValidationError") {
      return res.status(400).json({ error: "Invalid muscleGroup value" });
    }
    throw err;
  }
}
