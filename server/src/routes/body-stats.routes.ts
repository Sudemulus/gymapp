import { Router } from "express";
import {
  getBodyStats,
  createBodyStat,
  updateBodyStat,
  deleteBodyStat,
} from "../controllers/bodyStats.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getBodyStats);
router.post("/", createBodyStat);
router.put("/:id", updateBodyStat);
router.delete("/:id", deleteBodyStat);

export default router;
