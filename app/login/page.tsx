"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from "@/services/authClientService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await loginWithEmail(email, password);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setOauthLoading(provider);

    if (provider === "google") {
      await loginWithGoogle();
    }

    if (provider === "facebook") {
      await loginWithFacebook();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-2">
          เข้าสู่ระบบ LMS
        </h1>

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
          className="w-full bg-blue-600 text-white rounded-xl py-3"
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
          onClick={() => handleOAuth("google")}
          className="w-full border rounded-xl py-3 mb-3"
        >
          {oauthLoading === "google"
            ? "กำลังเชื่อมต่อ Google..."
            : "Login ด้วย Google"}
        </button>

        <button
          type="button"
          disabled={oauthLoading !== null}
          onClick={() => handleOAuth("facebook")}
          className="w-full border rounded-xl py-3"
        >
          {oauthLoading === "facebook"
            ? "กำลังเชื่อมต่อ Facebook..."
            : "Login ด้วย Facebook"}
        </button>
      </form>
    </main>
  );
}