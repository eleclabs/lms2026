import { apiGet, apiPost, apiPatch, apiDelete } from "@/services/core/httpService";
import { Lesson, LessonForm } from "@/types/lesson";

export function getLessonsByCourse(courseId: string) {
  return apiGet<Lesson[]>(`/api/teacher/lessons?courseId=${courseId}`);
}

export function createLesson(form: LessonForm) {
  return apiPost<Lesson>("/api/teacher/lessons", form);
}

export function updateLesson(lessonId: string, form: LessonForm) {
  return apiPatch<Lesson>(`/api/teacher/lessons/${lessonId}`, form);
}

export function deleteLesson(lessonId: string) {
  return apiDelete<{ message: string }>(`/api/teacher/lessons/${lessonId}`);
}

