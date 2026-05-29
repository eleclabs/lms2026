"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { registerUser } from "@/services/client/authService";
import { RegisterPayload } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRegister(payload: RegisterPayload) {
    try {
      setLoading(true);

      await registerUser(payload);

      alert("สมัครสมาชิกสำเร็จ");
      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "สมัครสมาชิกไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="สมัครสมาชิก LMS"
      description="สร้างบัญชีเพื่อเข้าใช้งานระบบ"
    >
      <RegisterForm
        loading={loading}
        onSubmit={handleRegister}
      />
    </AuthCard>
  );
}