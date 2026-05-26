import { signIn, signOut } from "next-auth/react";
import {
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types/auth";

export async function loginWithEmail(email: string, password: string) {
  const res = await signIn("credentials", {
    email: email.toLowerCase().trim(),
    password,
    redirect: false,
  });

  if (!res?.ok) {
    throw new Error("Email หรือ Password ไม่ถูกต้อง");
  }

  return res;
}

export async function loginWithGoogle() {
  return signIn("google", {
    callbackUrl: "/dashboard",
  });
}

export async function loginWithFacebook() {
  return signIn("facebook", {
    callbackUrl: "/dashboard",
  });
}

export async function logout() {
  return signOut({
    callbackUrl: "/login",
  });
}

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
  }

  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "ส่งอีเมลไม่สำเร็จ");
  }

  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
  }

  return data;
}

