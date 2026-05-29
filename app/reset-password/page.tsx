"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { resetPassword } from "@/services/client/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";

  const [loading, setLoading] = useState(false);

  async function handleResetPassword(password: string) {
    try {
      setLoading(true);

      await resetPassword({
        token,
        password,
      });

      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "เปลี่ยนรหัสผ่านไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="ตั้งรหัสผ่านใหม่"
      description="กรอกรหัสผ่านใหม่สำหรับบัญชีของคุณ"
    >
      <ResetPasswordForm
        loading={loading}
        disabled={!token}
        onSubmit={handleResetPassword}
      />
    </AuthCard>
  );
}