import {
  apiGet,
  apiPost,
} from "@/services/core/httpService";

import { Enrollment } from "@/types/enrollment";

export function getMyEnrollments() {
  return apiGet<Enrollment[]>("/api/student/my-courses");
}

export function enrollCourse(courseId: string) {
  return apiPost<{ message: string }>("/api/student/enrollments", {
    courseId,
  });
}