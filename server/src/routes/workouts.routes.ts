import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  addSetToWorkout,
  repeatWorkout,
} from "../controllers/workouts.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.post("/:id/sets", addSetToWorkout);
router.post("/:id/repeat", repeatWorkout);

export default router;
