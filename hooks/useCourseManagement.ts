"use client";

import { FormEvent, useEffect, useState } from "react";
import { getCategories } from "@/services/client/categoryService";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/services/client/courseService";
import { uploadCoverImage } from "@/services/core/uploadService";
import { Category } from "@/types/category";
import { Course, CourseForm, defaultCourseForm } from "@/types/course";

export type ManagementScope = "admin" | "teacher";

export function useCourseManagement(scope: ManagementScope) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CourseForm>(defaultCourseForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function reload() {
    const [courseData, categoryData] = await Promise.all([
      getCourses(scope),
      getCategories(),
    ]);
    setCourses(courseData);
    setCategories(categoryData);
  }

  useEffect(() => {
    let active = true;
    Promise.all([getCourses(scope), getCategories()])
      .then(([courseData, categoryData]) => {
        if (!active) return;
        setCourses(courseData);
        setCategories(categoryData);
      })
      .catch((error) => {
        if (active) {
          alert(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
        }
      });
    return () => {
      active = false;
    };
  }, [scope]);

  function startCreate() {
    setForm(defaultCourseForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(course: Course) {
    const category =
      typeof course.category === "object"
        ? course.category?._id || ""
        : course.category || "";
    setForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price || 0,
      category,
      level: course.level || "beginner",
      thumbnail: course.thumbnail || "",
      thumbnailPublicId: course.thumbnailPublicId || "",
      published: Boolean(course.published),
    });
    setEditingId(course._id);
    setShowForm(true);
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
      const uploaded = await uploadCoverImage(file);
      setForm((current) => ({
        ...current,
        thumbnail: uploaded.url,
        thumbnailPublicId: uploaded.publicId,
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (scope === "admin" && !editingId) return;

    try {
      setLoading(true);
      if (editingId) {
        await updateCourse(editingId, form, scope);
      } else {
        await createCourse(form, "teacher");
      }
      resetForm();
      await reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "บันทึกหลักสูตรไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm("ต้องการลบหลักสูตรนี้ใช่หรือไม่?")) return;
    try {
      await deleteCourse(courseId, scope);
      await reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ลบหลักสูตรไม่สำเร็จ");
    }
  }

  return {
    courses,
    categories,
    form,
    setForm,
    editingId,
    showForm,
    loading,
    uploading,
    startCreate,
    startEdit,
    resetForm,
    handleUpload,
    handleSubmit,
    handleDelete,
  };
}
