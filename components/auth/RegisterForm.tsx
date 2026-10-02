"use client";

import { useState } from "react";
import Link from "next/link";
import { RegisterPayload } from "@/types/auth";

type Props = {
  loading?: boolean;
  onSubmit: (payload: RegisterPayload) => Promise<void>;
};

export default function RegisterForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        placeholder="ชื่อ-นามสกุล"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-4"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <button
        disabled={loading}
        className="btn btn-primary "
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
  );
}