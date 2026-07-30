import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword } from "../controllers/users.controller";
import { authenticate } from "../middleware/auth";
import { forgotPasswordRateLimit } from "../middleware/rateLimit";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/forgot-password", forgotPasswordRateLimit, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
