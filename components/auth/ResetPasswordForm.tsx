"use client";

import { useState } from "react";

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (password: string) => Promise<void>;
};

export default function ResetPasswordForm({
  loading,
  disabled,
  onSubmit,
}: Props) {
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(password);
      }}
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-4"
        type="password"
        placeholder="Password ใหม่"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        disabled={loading || disabled}
        className="w-full bg-green-600 text-white rounded-xl py-3 disabled:bg-gray-400"
      >
        {loading ? "กำลังบันทึก..." : "Reset Password"}
      </button>
    </form>
  );
}

