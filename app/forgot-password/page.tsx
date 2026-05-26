

"use client";

import { useState } from "react";
import Link from "next/link";

import { forgotPassword } from "@/services/authClientService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await forgotPassword({ email });
      setMessage(data.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : "ส่งอีเมลไม่สำเร็จ");
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
          ลืมรหัสผ่าน
        </h1>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          type="email"
          placeholder="กรอก Email ที่ลงทะเบียน"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-xl py-3"
        >
          {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </button>

        {message && (
          <p className="text-center text-sm text-green-600 mt-4">
            {message}
          </p>
        )}

        <div className="text-center mt-4 text-sm">
          <Link href="/login">กลับไปหน้า Login</Link>
        </div>
      </form>
    </main>
  );
}

