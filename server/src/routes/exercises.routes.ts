import { Router } from "express";
import {
  getExercises,
  getExerciseById,
  createExercise,
  getLastPerformance,
} from "../controllers/exercises.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getExercises);
router.get("/:id/last-performance", authenticate, getLastPerformance);
router.get("/:id", getExerciseById);
router.post("/", createExercise);

export default router;
