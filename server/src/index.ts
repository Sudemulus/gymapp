import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.routes";
import exercisesRoutes from "./routes/exercises.routes";
import workoutsRoutes from "./routes/workouts.routes";
import workoutSetsRoutes from "./routes/workout-sets.routes";
import analyticsRoutes from "./routes/analytics.routes";
import bodyStatsRoutes from "./routes/body-stats.routes";

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

app.use("/api/users", usersRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/workout-sets", workoutSetsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/body-stats", bodyStatsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
