import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateResetCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashResetCode(code: string) {
  return bcrypt.hash(code, 10);
}

export function compareResetCode(code: string, hash: string) {
  return bcrypt.compare(code, hash);
}
