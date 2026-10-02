"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import {
  loginWithEmail,
  loginWithFacebook,
  loginWithGoogle,
} from "@/services/client/authService";

function safeCallbackUrl(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      await loginWithEmail(email, password);
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setOauthLoading("google");
    await loginWithGoogle(callbackUrl);
  }

  async function handleFacebook() {
    setOauthLoading("facebook");
    await loginWithFacebook(callbackUrl);
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
