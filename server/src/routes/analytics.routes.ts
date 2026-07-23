import { Router } from "express";
import { getVolumeAnalytics } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/volume", getVolumeAnalytics);

export default router;
