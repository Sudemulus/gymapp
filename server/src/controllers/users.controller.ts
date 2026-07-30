import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { sendPasswordResetEmail } from "../lib/mailer";
import { generateResetCode, hashResetCode, compareResetCode } from "../lib/resetCode";

const RESET_COOLDOWN_MS = 60 * 1000;
const RESET_CODE_TTL_MS = 15 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;
const GENERIC_REQUEST_MESSAGE = "Eğer bu e-posta adresi kayıtlıysa, bir sıfırlama kodu gönderildi.";
const GENERIC_RESET_ERROR = "Kod geçersiz veya süresi dolmuş.";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A user with this email already exists" });
    }
    throw err;
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const now = Date.now();
    const inCooldown =
      user.resetRequestedAt && now - user.resetRequestedAt.getTime() < RESET_COOLDOWN_MS;

    if (!inCooldown) {
      const code = generateResetCode();
      const resetCodeHash = await hashResetCode(code);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetCodeHash,
          resetCodeExpires: new Date(now + RESET_CODE_TTL_MS),
          resetCodeAttempts: 0,
          resetRequestedAt: new Date(now),
        },
      });

      try {
        await sendPasswordResetEmail(user.email, code);
      } catch (err) {
        console.error("Failed to send password reset email:", err);
      }
    }
  }

  res.json({ message: GENERIC_REQUEST_MESSAGE });
}

export async function resetPassword(req: Request, res: Response) {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "email, code and newPassword are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "newPassword must be at least 6 characters" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetCodeHash || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
    return res.status(400).json({ error: GENERIC_RESET_ERROR });
  }

  const matches = await compareResetCode(code, user.resetCodeHash);
  if (!matches) {
    const attempts = user.resetCodeAttempts + 1;
    const invalidated = attempts >= MAX_RESET_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: invalidated
        ? { resetCodeHash: null, resetCodeExpires: null, resetCodeAttempts: 0 }
        : { resetCodeAttempts: attempts },
    });

    return res.status(400).json({ error: GENERIC_RESET_ERROR });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetCodeHash: null,
      resetCodeExpires: null,
      resetCodeAttempts: 0,
      resetRequestedAt: null,
    },
  });

  res.json({ message: "Şifreniz başarıyla güncellendi." });
}
