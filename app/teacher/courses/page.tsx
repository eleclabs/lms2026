"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import CourseForm from "@/components/courses/CourseForm";
import CourseGrid from "@/components/courses/CourseGrid";

import {
  Course,
  CourseForm as CourseFormType,
  defaultCourseForm,
} from "@/types/course";

import { Category } from "@/types/category";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services/client/courseService";

import { getCategories } from "@/services/client/categoryService";
import { uploadCoverImage } from "@/services/core/uploadService";



export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CourseFormType>(defaultCourseForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    const [courseData, categoryData] = await Promise.all([
      getCourses("teacher"),
      getCategories(),
    ]);

    setCourses(courseData);
    setCategories(categoryData);
  }

  function startCreate() {
    setForm(defaultCourseForm);
    setEditingId(null);
    setShowForm(true);
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
      alert(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }




  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await updateCourse(editingId, form, "teacher");
      } else {
        await createCourse(form, "teacher");
      }

      resetForm();
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm("ต้องการลบรายวิชานี้ใช่หรือไม่?")) return;

    try {
      await deleteCourse(courseId, "teacher");
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
          title="จัดการรายวิชาของครู"
          description="เพิ่ม แก้ไข ลบ และจัดการบทเรียน"
          actionLabel="+ เพิ่มรายวิชา"
          onAction={startCreate}
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
          role="teacher"
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}

