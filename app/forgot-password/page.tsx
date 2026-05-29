
"use client";

import { useState } from "react";

import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { forgotPassword } from "@/services/client/authService";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleForgotPassword(email: string) {
    try {
      setLoading(true);

      const data = await forgotPassword({ email });

      setMessage(data.message);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "ส่งอีเมลไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="ลืมรหัสผ่าน"
      description="กรอก Email เพื่อรับลิงก์ตั้งรหัสผ่านใหม่"
    >
      <ForgotPasswordForm
        loading={loading}
        message={message}
        onSubmit={handleForgotPassword}
      />
    </AuthCard>
  );
}

