import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  const { workoutId, exerciseId, setNumber, weightKg, reps, completed } = req.body;

  const workout = await prisma.workout.findUnique({ where: { id: Number(workoutId) } });
  if (!workout || workout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const set = await prisma.workoutSet.create({
    data: { workoutId, exerciseId, setNumber, weightKg, reps, completed: completed ?? false },
  });
  res.status(201).json(set);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { weightKg, reps, completed } = req.body;

  const existing = await prisma.workoutSet.findUnique({
    where: { id },
    include: { workout: true },
  });
  if (!existing || existing.workout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout set not found" });
  }

  if (weightKg === undefined || reps === undefined) {
    return res.status(400).json({ error: "weightKg and reps are required" });
  }

  const set = await prisma.workoutSet.update({
    where: { id },
    data: { weightKg, reps, completed: completed ?? existing.completed },
  });
  res.json(set);
});

router.delete("/:id", async (req, res) => {
  const set = await prisma.workoutSet.findUnique({
    where: { id: Number(req.params.id) },
    include: { workout: true },
  });
  if (!set || set.workout.userId !== req.userId) {
    return res.status(404).json({ error: "Workout set not found" });
  }

  await prisma.workoutSet.delete({ where: { id: set.id } });
  res.status(204).send();
});

export default router;
