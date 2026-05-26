/* "use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { resetPassword } from "@/services/authClientService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          ตั้งรหัสผ่านใหม่
        </h1>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          type="password"
          placeholder="Password ใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading || !token}
          className="w-full bg-green-600 text-white rounded-xl py-3"
        >
          {loading ? "กำลังบันทึก..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
} */



import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

