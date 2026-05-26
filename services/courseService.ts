import { CourseForm } from "@/types/course";

export async function getTeacherCourses() {
  const res = await fetch("/api/teacher/courses", {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "โหลดรายวิชาไม่สำเร็จ");
  }

  return Array.isArray(data) ? data : [];
}

export async function createTeacherCourse(form: CourseForm) {
  const res = await fetch("/api/teacher/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      title: form.title.trim(),
      category: form.category || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "เพิ่มรายวิชาไม่สำเร็จ");
  }

  return data;
}

export async function updateTeacherCourse(
  courseId: string,
  form: CourseForm
) {
  const res = await fetch(`/api/teacher/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      title: form.title.trim(),
      category: form.category || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "แก้ไขรายวิชาไม่สำเร็จ");
  }

  return data;
}

export async function deleteTeacherCourse(courseId: string) {
  const res = await fetch(`/api/teacher/courses/${courseId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "ลบรายวิชาไม่สำเร็จ");
  }

  return data;
}