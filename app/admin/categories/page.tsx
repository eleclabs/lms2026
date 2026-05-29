"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";
import EmptyState from "@/components/shared/EmptyState";
import { Category, CategoryForm as CategoryFormType } from "@/types/category";
import {
  getCategories,
  createCategory,
} from "@/services/client/categoryService";

const defaultForm = {
  name: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormType>(defaultForm);
  const [loading, setLoading] = useState(false);

  async function loadCategories() {
    setCategories(await getCategories());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("กรุณากรอกชื่อหมวดหมู่");
      return;
    }

    setLoading(true);
    await createCategory(form);
    setLoading(false);

    setForm(defaultForm);
    await loadCategories();
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <PageHeader
        title="จัดการหมวดหมู่รายวิชา"
        description="เพิ่มหมวดหมู่สำหรับจัดกลุ่มรายวิชา"
      />

      <CategoryForm
        form={form}
        loading={loading}
        onChange={setForm}
        onSubmit={handleSubmit}
      />

      {categories.length > 0 ? (
        <CategoryList categories={categories} />
      ) : (
        <EmptyState message="ยังไม่มีหมวดหมู่" />
      )}
    </main>
  );
}

