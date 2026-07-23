import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getBodyStats(req: Request, res: Response) {
  const stats = await prisma.bodyMeasurement.findMany({
    where: { userId: req.userId },
    orderBy: { date: "asc" },
  });
  res.json(stats);
}

export async function createBodyStat(req: Request, res: Response) {
  const { weight, chest, waist, biceps, thigh, date } = req.body;

  if (weight === undefined || weight === null || !date) {
    return res.status(400).json({ error: "weight and date are required" });
  }

  const stat = await prisma.bodyMeasurement.create({
    data: {
      userId: req.userId as number,
      weight,
      chest: chest ?? null,
      waist: waist ?? null,
      biceps: biceps ?? null,
      thigh: thigh ?? null,
      date: new Date(date),
    },
  });
  res.status(201).json(stat);
}

export async function updateBodyStat(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { weight, chest, waist, biceps, thigh, date } = req.body;

  const existing = await prisma.bodyMeasurement.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Body stat not found" });
  }

  if (weight === undefined || weight === null || !date) {
    return res.status(400).json({ error: "weight and date are required" });
  }

  const stat = await prisma.bodyMeasurement.update({
    where: { id },
    data: {
      weight,
      chest: chest ?? null,
      waist: waist ?? null,
      biceps: biceps ?? null,
      thigh: thigh ?? null,
      date: new Date(date),
    },
  });
  res.json(stat);
}

export async function deleteBodyStat(req: Request, res: Response) {
  const id = Number(req.params.id);

  const existing = await prisma.bodyMeasurement.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Body stat not found" });
  }

  await prisma.bodyMeasurement.delete({ where: { id } });
  res.status(204).send();
}
