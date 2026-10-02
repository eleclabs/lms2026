import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/services/core/httpService";

import { Course, CourseForm } from "@/types/course";
import { normalizeCoursePayload } from "@/services/shared/courseMapper";

export type CourseScope = "admin" | "teacher" | "student" | "public";

function baseUrl(scope: CourseScope) {
  if (scope === "admin") return "/api/admin/courses";
  if (scope === "teacher") return "/api/teacher/courses";
  if (scope === "student") return "/api/student/courses";
  return "/api/courses";
}

export function getCourses(scope: CourseScope = "public") {
  return apiGet<Course[]>(baseUrl(scope));
}

export function getCourseById(courseId: string, scope: CourseScope = "public") {
  return apiGet<Course>(`${baseUrl(scope)}/${courseId}`);
}

export function createCourse(form: CourseForm, scope: "admin" | "teacher") {
  return apiPost<Course>(baseUrl(scope), normalizeCoursePayload(form));
}

export function updateCourse(
  courseId: string,
  form: CourseForm,
  scope: "admin" | "teacher"
) {
  return apiPatch<Course>(
    `${baseUrl(scope)}/${courseId}`,
    normalizeCoursePayload(form)
  );
}

export function deleteCourse(courseId: string, scope: "admin" | "teacher") {
  return apiDelete<{ message: string }>(`${baseUrl(scope)}/${courseId}`);
}

export function rateCourse(courseId: string, rating: number) {
  return apiPost<{
    message: string;
    ratingAverage: number;
    ratingCount: number;
    userRating: number;
  }>(`/api/student/courses/${courseId}/rating`, { rating });
}
