
"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  loading?: boolean;
  oauthLoading?: "google" | "facebook" | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogle: () => void;
  onFacebook: () => void;
};

export default function LoginForm({
  loading,
  oauthLoading,
  onLogin,
  onGoogle,
  onFacebook,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(email, password);
      }}
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        disabled={loading}
        className="btn btn-light w-full"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
      </button>

      <div className="flex justify-between mt-4 text-sm">
        <Link href="/register">สมัครสมาชิก</Link>
        <Link href="/forgot-password">ลืมรหัสผ่าน?</Link>
      </div>

      <hr className="my-5" />

      <button
        type="button"
        disabled={oauthLoading !== null}
        onClick={onGoogle}
        className="btn btn-danger mb-3 w-full"
      >
        {oauthLoading === "google"
          ? "กำลังเชื่อมต่อ Google..."
          : "Login ด้วย Google"}
      </button>

      <button
        type="button"
        disabled={oauthLoading !== null}
        onClick={onFacebook}
        className="btn btn-primary w-full"
      >
        {oauthLoading === "facebook"
          ? "กำลังเชื่อมต่อ Facebook..."
          : "Login ด้วย Facebook"}
      </button>
    </form>
  );
}