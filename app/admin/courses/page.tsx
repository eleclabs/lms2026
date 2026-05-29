"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseForm from "@/components/courses/CourseForm";

import {
  Course,
  CourseForm as CourseFormType,
  defaultCourseForm,
} from "@/types/course";

import { Category } from "@/types/category";

import {
  getCourses,
  updateCourse,
  deleteCourse,
} from "@/services/client/courseService";

import { getCategories } from "@/services/client/categoryService";
import { uploadCoverImage } from "@/services/core/uploadService";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<CourseFormType>(defaultCourseForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    try {
      const [courseData, categoryData] = await Promise.all([
        getCourses("admin"),
        getCategories(),
      ]);

      setCourses(courseData);
      setCategories(categoryData);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "โหลดข้อมูลไม่สำเร็จ"
      );
    }
  }

  function startEdit(course: Course) {
    const categoryId =
      typeof course.category === "object"
        ? course.category?._id || ""
        : course.category || "";

    setEditingId(course._id);
    setShowForm(true);

    setForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price || 0,
      category: categoryId,
      level: course.level || "beginner",
      thumbnail: course.thumbnail || "",
      published: Boolean(course.published),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(defaultCourseForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      const url = await uploadCoverImage(file);

      setForm((prev) => ({
        ...prev,
        thumbnail: url,
      }));
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "อัปโหลดรูปไม่สำเร็จ"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingId) return;

    try {
      setLoading(true);

      await updateCourse(editingId, form, "admin");

      alert("แก้ไขรายวิชาสำเร็จ");

      resetForm();
      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "แก้ไขรายวิชาไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm("ต้องการลบรายวิชานี้ใช่หรือไม่?")) return;

    try {
      await deleteCourse(courseId, "admin");
      alert("ลบรายวิชาสำเร็จ");
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ลบไม่สำเร็จ");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="จัดการรายวิชาทั้งหมด"
          description="Admin สามารถตรวจสอบ แก้ไข และลบรายวิชาได้"
        />

        {showForm && (
          <CourseForm
            form={form}
            categories={categories}
            loading={loading}
            uploading={uploading}
            editing={Boolean(editingId)}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onUpload={handleUpload}
          />
        )}

        <CourseGrid
          courses={courses}
          role="admin"
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}

