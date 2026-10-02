import { CourseForm } from "@/types/course";

export function normalizeCoursePayload(form: CourseForm) {
  return {
    title: form.title.trim(),
    description: form.description,
    price: Number(form.price) || 0,
    category: form.category || undefined,
    level: form.level || "beginner",
    thumbnail: form.thumbnail || "",
    thumbnailPublicId: form.thumbnailPublicId || "",
    published: Boolean(form.published),
  };
}
