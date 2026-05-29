
import crypto from "crypto";

export function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashResetToken(rawToken);

  return {
    rawToken,
    hashedToken,
  };
}

export function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export function getResetTokenExpires() {
  return new Date(Date.now() + 1000 * 60 * 30);
}
