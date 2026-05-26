"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="รหัสผ่านใหม่"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">เปลี่ยนรหัสผ่าน</button>
    </form>
  );
}

