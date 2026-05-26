"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setForm({ name: "", description: "" });
      loadCategories();
    } else {
      alert(data.message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">จัดการหมวดหมู่รายวิชา</h1>

      <form
        onSubmit={createCategory}
        className="bg-white rounded-2xl shadow p-6 mb-6 max-w-xl"
      >
        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="ชื่อหมวดหมู่ เช่น Programming"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="รายละเอียด"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
          เพิ่มหมวดหมู่
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-xl p-5 shadow">
            <h2 className="font-bold">{cat.name}</h2>
            <p className="text-sm text-gray-500">{cat.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

