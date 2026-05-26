"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Course, Category, CourseForm } from "@/types/course";
import { defaultCourseForm, courseLevels } from "@/constants/course";

import {
  getTeacherCourses,
  createTeacherCourse,
  updateTeacherCourse,
  deleteTeacherCourse,
} from "@/services/courseService";

import { getCategories } from "@/services/categoryService";
import { uploadCoverImage } from "@/services/uploadService";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<CourseForm>(defaultCourseForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    try {
      const [courseData, categoryData] = await Promise.all([
        getTeacherCourses(),
        getCategories(),
      ]);

      setCourses(courseData);
      setCategories(categoryData);
    } catch (error) {
      alert(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }

  function getCategoryName(category?: Course["category"]) {
    if (!category) return "ไม่ระบุหมวดหมู่";
    if (typeof category === "string") return category;
    return category.name;
  }

  function getCategoryId(category?: Course["category"]) {
    if (!category) return "";
    if (typeof category === "string") return category;
    return category._id;
  }

  function resetForm() {
    setForm(defaultCourseForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate() {
    setForm(defaultCourseForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(course: Course) {
    setEditingId(course._id);
    setShowForm(true);

    setForm({
      title: course.title || "",
      description: course.description || "",
      category: getCategoryId(course.category),
      level: course.level || "beginner",
      thumbnail: course.thumbnail || "",
      published: Boolean(course.published),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true);
      const url = await uploadCoverImage(file);
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  async function submitCourse(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("กรุณากรอกชื่อรายวิชา");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateTeacherCourse(editingId, form);
        alert("แก้ไขรายวิชาสำเร็จ");
      } else {
        await createTeacherCourse(form);
        alert("เพิ่มรายวิชาสำเร็จ");
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
      await deleteTeacherCourse(courseId);
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">จัดการรายวิชาของครู</h1>
            <p className="text-gray-500 mt-1">
              เพิ่ม แก้ไข ลบ และจัดการบทเรียน
            </p>
          </div>

          <button
            onClick={startCreate}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            + เพิ่มรายวิชา
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={submitCourse}
            className="bg-white rounded-2xl shadow p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border rounded-xl px-4 py-3"
                placeholder="ชื่อรายวิชา"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <select
                className="border rounded-xl px-4 py-3"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-xl px-4 py-3"
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: e.target.value })
                }
              >
                {courseLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <label className="border rounded-xl px-4 py-3 cursor-pointer bg-white">
                {uploading ? "กำลังอัปโหลด..." : "แนบรูปภาพปก"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            </div>

            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="thumbnail"
                className="mt-4 h-48 w-full object-cover rounded-xl"
              />
            )}

            <textarea
              className="w-full border rounded-xl px-4 py-3 mt-4"
              rows={4}
              placeholder="รายละเอียดรายวิชา"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              เผยแพร่รายวิชา
            </label>

            <div className="flex gap-3 mt-5">
              <button
                disabled={loading || uploading}
                className="bg-green-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
              >
                {loading
                  ? "กำลังบันทึก..."
                  : editingId
                  ? "บันทึกการแก้ไข"
                  : "บันทึกรายวิชา"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border px-6 py-3 rounded-xl"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Cover
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {getCategoryName(course.category)}
                  </span>

                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                    {course.level || "beginner"}
                  </span>
                </div>

                <h2 className="font-bold text-lg">{course.title}</h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {course.description || "ไม่มีรายละเอียด"}
                </p>

                <p
                  className={`text-sm mt-3 ${
                    course.published ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {course.published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-5">
                  <Link
                    href={`/teacher/courses/${course._id}/lessons`}
                    className="text-center bg-blue-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    บทเรียน
                  </Link>

                  <button
                    onClick={() => startEdit(course)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    แก้ไข
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            ยังไม่มีรายวิชา
          </div>
        )}
      </div>
    </main>
  );
}

