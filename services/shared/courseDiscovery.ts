import { Course } from "@/types/course";

export function courseMatchesQuery(course: Course, query: string) {
  const category =
    typeof course.category === "object" ? course.category?.name : course.category;
  const teacher =
    typeof course.teacher === "object" ? course.teacher?.name : "";
  const searchable = [course.title, course.description, category, teacher]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("th");
  return searchable.includes(query.toLocaleLowerCase("th").trim());
}

export function getRecommendedCourses(courses: Course[], limit = 4) {
  return [...courses]
    .sort(
      (a, b) =>
        (b.ratingAverage || 0) * 10 +
        Math.min(b.ratingCount || 0, 20) +
        Math.min(b.enrollmentCount || 0, 50) -
        ((a.ratingAverage || 0) * 10 +
          Math.min(a.ratingCount || 0, 20) +
          Math.min(a.enrollmentCount || 0, 50))
    )
    .slice(0, limit);
}

export function getTopRatedCourses(courses: Course[], limit = 4) {
  return [...courses]
    .sort(
      (a, b) =>
        (b.ratingAverage || 0) - (a.ratingAverage || 0) ||
        (b.ratingCount || 0) - (a.ratingCount || 0)
    )
    .slice(0, limit);
}
