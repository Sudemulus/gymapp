import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getWorkouts(req: Request, res: Response) {
  const workouts = await prisma.workout.findMany({
    where: { userId: req.userId },
    include: { sets: true },
    orderBy: { date: "desc" },
  });
  res.json(workouts);
}

export async function getWorkoutById(req: Request, res: Response) {
  const workout = await prisma.workout.findUnique({
    where: { id: Number(req.params.id) },
    include: { sets: { include: { exercise: true } } },
  });
  if (!workout || workout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout not found" });
  }
  res.json(workout);
}

export async function createWorkout(req: Request, res: Response) {
  const { name, date, notes } = req.body;
  if (!name || !date) {
    return res.status(400).json({ error: "name and date are required" });
  }

  const workout = await prisma.workout.create({
    data: { userId: req.userId as number, name, date: new Date(date), notes },
  });
  res.status(201).json(workout);
}

export async function repeatWorkout(req: Request, res: Response) {
  const sourceWorkout = await prisma.workout.findUnique({
    where: { id: Number(req.params.id) },
    include: { sets: { orderBy: { setNumber: "asc" } } },
  });
  if (!sourceWorkout || sourceWorkout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const workout = await prisma.workout.create({
    data: {
      userId: req.userId as number,
      name: sourceWorkout.name,
      date: new Date(),
      sets: {
        create: sourceWorkout.sets.map((set) => ({
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg: set.weightKg,
          reps: set.reps,
          completed: false,
        })),
      },
    },
    include: { sets: { include: { exercise: true } } },
  });

  res.status(201).json(workout);
}

export async function addSetToWorkout(req: Request, res: Response) {
  const workoutId = Number(req.params.id);
  const { exerciseId, weightKg, reps, completed } = req.body;

  if (!exerciseId || weightKg === undefined || reps === undefined) {
    return res.status(400).json({ error: "exerciseId, weightKg and reps are required" });
  }

  const workout = await prisma.workout.findUnique({ where: { id: workoutId } });
  if (!workout || workout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const existingSetCount = await prisma.workoutSet.count({ where: { workoutId } });

  try {
    const set = await prisma.workoutSet.create({
      data: {
        workoutId,
        exerciseId,
        setNumber: existingSetCount + 1,
        weightKg,
        reps,
        completed: completed ?? false,
      },
    });
    res.status(201).json(set);
  } catch (err: any) {
    if (err.code === "P2003") {
      return res.status(400).json({ error: "exerciseId does not reference an existing exercise" });
    }
    throw err;
  }
}
