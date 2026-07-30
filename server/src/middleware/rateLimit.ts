import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function forgotPasswordRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." });
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  next();
}
