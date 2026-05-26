import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "@/models/User";
import { RegisterPayload } from "@/types/auth";
import { DEFAULT_ROLE } from "@/constants/auth";

export async function findUserByEmail(email: string) {
  return User.findOne({
    email: email.toLowerCase().trim(),
  });
}

export async function createCredentialsUser(payload: RegisterPayload) {
  const email = payload.email.toLowerCase().trim();

  const exists = await findUserByEmail(email);

  if (exists) {
    throw new Error("Email นี้ถูกใช้งานแล้ว");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return User.create({
    name: payload.name,
    email,
    password: hashedPassword,
    provider: "credentials",
    role: DEFAULT_ROLE,
  });
}

export async function createOAuthUserIfNotExists(user: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}) {
  if (!user.email) {
    throw new Error("ไม่พบ Email");
  }

  const email = user.email.toLowerCase();

  const exists = await findUserByEmail(email);

  if (exists) {
    return exists;
  }

  return User.create({
    name: user.name || "",
    email,
    image: user.image || "",
    provider: user.provider || "oauth",
    role: DEFAULT_ROLE,
  });
}

export async function validateUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}

export function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
}

export async function saveResetToken(email: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const { rawToken, hashedToken } = createResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);

  await user.save();

  return {
    user,
    rawToken,
  };
}

export async function resetUserPassword(token: string, password: string) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("ลิงก์หมดอายุหรือไม่ถูกต้อง");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
}

