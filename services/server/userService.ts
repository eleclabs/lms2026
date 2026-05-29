
import User from "@/models/User";
import { RegisterPayload } from "@/types/auth";
import { DEFAULT_ROLE } from "@/constants/auth";
import { hashPassword, comparePassword } from "./passwordService";
import {
  createResetToken,
  hashResetToken,
  getResetTokenExpires,
} from "./tokenService";

export async function findUserByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

export async function createCredentialsUser(payload: RegisterPayload) {
  const email = payload.email.toLowerCase().trim();

  const exists = await findUserByEmail(email);
  if (exists) throw new Error("Email นี้ถูกใช้งานแล้ว");

  return User.create({
    name: payload.name.trim(),
    email,
    password: await hashPassword(payload.password),
    provider: "credentials",
    role: DEFAULT_ROLE,
  });
}

export async function validateUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user || !user.password) return null;

  const valid = await comparePassword(password, user.password);

  return valid ? user : null;
}

export async function createOAuthUserIfNotExists(payload: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}) {
  if (!payload.email) throw new Error("ไม่พบ Email");

  const email = payload.email.toLowerCase().trim();
  const exists = await findUserByEmail(email);

  if (exists) return exists;

  return User.create({
    name: payload.name || "",
    email,
    image: payload.image || "",
    provider: payload.provider || "oauth",
    role: DEFAULT_ROLE,
  });
}

export async function saveResetToken(email: string) {
  const user = await findUserByEmail(email);

  if (!user) return null;

  const { rawToken, hashedToken } = createResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = getResetTokenExpires();

  await user.save();

  return { user, rawToken };
}

export async function resetUserPassword(token: string, password: string) {
  const hashedToken = hashResetToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("ลิงก์หมดอายุหรือไม่ถูกต้อง");

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
}