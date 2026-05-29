import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/services/core/httpService";

import { Course, CourseForm } from "@/types/course";

export type CourseScope = "admin" | "teacher" | "student" | "public";

function baseUrl(scope: CourseScope) {
  if (scope === "admin") return "/api/admin/courses";
  if (scope === "teacher") return "/api/teacher/courses";
  if (scope === "student") return "/api/student/courses";
  return "/api/courses";
}

function normalizeCourseForm(form: CourseForm) {
  return {
    title: form.title.trim(),
    description: form.description,
    price: Number(form.price) || 0,
    category: form.category || undefined,
    level: form.level,
    thumbnail: form.thumbnail,
    published: Boolean(form.published),
  };
}

export function getCourses(scope: CourseScope) {
  return apiGet<Course[]>(baseUrl(scope));
}

export function getCourseById(courseId: string, scope: CourseScope) {
  return apiGet<Course>(`${baseUrl(scope)}/${courseId}`);
}

export function createCourse(form: CourseForm, scope: "admin" | "teacher") {
  return apiPost<Course>(baseUrl(scope), normalizeCourseForm(form));
}

export function updateCourse(
  courseId: string,
  form: CourseForm,
  scope: "admin" | "teacher"
) {
  return apiPatch<Course>(
    `${baseUrl(scope)}/${courseId}`,
    normalizeCourseForm(form)
  );
}

export function deleteCourse(courseId: string, scope: "admin" | "teacher") {
  return apiDelete<{ message: string }>(`${baseUrl(scope)}/${courseId}`);
}