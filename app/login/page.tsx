
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from "@/services/client/authService";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);

      await loginWithEmail(email, password);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setOauthLoading("google");
    await loginWithGoogle();
  }

  async function handleFacebook() {
    setOauthLoading("facebook");
    await loginWithFacebook();
  }

  return (
    <AuthCard
      title="เข้าสู่ระบบ LMS"
      description="Login ด้วย Email หรือ Social Account"
    >
      <LoginForm
        loading={loading}
        oauthLoading={oauthLoading}
        onLogin={handleLogin}
        onGoogle={handleGoogle}
        onFacebook={handleFacebook}
      />
    </AuthCard>
  );
}