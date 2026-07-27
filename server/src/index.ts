import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.routes";
import exercisesRoutes from "./routes/exercises.routes";
import workoutsRoutes from "./routes/workouts.routes";
import workoutSetsRoutes from "./routes/workout-sets.routes";
import analyticsRoutes from "./routes/analytics.routes";
import bodyStatsRoutes from "./routes/body-stats.routes";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// TEMPORARY one-off fix, remove after running once against production.
app.get("/api/admin/fix-exercises", async (req, res) => {
  if (req.query.key !== process.env.JWT_SECRET) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  const swing = await prisma.exercise.updateMany({
    where: { name: "Kettlebell Swing" },
    data: { imageUrl: "https://static.exercisedb.dev/media/UHJlbu3.gif" },
  });

  const rower = await prisma.exercise.updateMany({
    where: { name: "Rower (Kurek Ergometre)" },
    data: {
      name: "Eliptik Bisiklet (Cross Trainer)",
      description: "Eliptik bisiklette kol ve bacak koordinasyonuyla yuruyus hareketi",
      imageUrl: "https://static.exercisedb.dev/media/rjtuP6X.gif",
    },
  });

  res.json({ swingUpdated: swing.count, rowerUpdated: rower.count });
});

app.use("/api/users", usersRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/workout-sets", workoutSetsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/body-stats", bodyStatsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
