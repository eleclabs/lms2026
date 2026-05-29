
import { signIn, signOut } from "next-auth/react";
import { apiPost } from "@/services/core/httpService";

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

export function loginWithGoogle() {
  return signIn("google", {
    callbackUrl: "/dashboard",
  });
}

export function loginWithFacebook() {
  return signIn("facebook", {
    callbackUrl: "/dashboard",
  });
}

export function logout() {
  return signOut({
    callbackUrl: "/login",
  });
}

export function registerUser(payload: RegisterPayload) {
  return apiPost<{ message: string }>("/api/auth/register", payload);
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiPost<{ message: string }>("/api/auth/forgot-password", payload);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiPost<{ message: string }>("/api/auth/reset-password", payload);
}
