"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/authClientService";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser(form);

      alert("สมัครสมาชิกสำเร็จ");
      router.push("/login");
    } catch (error) {
      alert(error instanceof Error ? error.message : "สมัครสมาชิกไม่สำเร็จ");
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
          สมัครสมาชิก LMS
        </h1>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="ชื่อ-นามสกุล"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-xl py-3"
        >
          {loading ? "กำลังสมัคร..." : "Register"}
        </button>

        <div className="text-center mt-4 text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </div>
      </form>
    </main>
  );
}