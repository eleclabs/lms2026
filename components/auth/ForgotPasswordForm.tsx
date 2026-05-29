"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  loading?: boolean;
  message?: string;
  onSubmit: (email: string) => Promise<void>;
};

export default function ForgotPasswordForm({
  loading,
  message,
  onSubmit,
}: Props) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email);
      }}
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-4"
        type="email"
        placeholder="กรอก Email ที่ลงทะเบียน"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-xl py-3 disabled:bg-gray-400"
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
  );
}

