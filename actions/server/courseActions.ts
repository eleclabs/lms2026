import { isValidObjectId } from "mongoose";
import { assertApi } from "@/lib/api/errors";
import { isImageInFolder } from "@/lib/cloudinary";
import {
  createCourseForTeacher,
  deleteManagedCourse,
  getPublicCourse,
  listManagedCourses,
  listPublicCourses,
  listStudentCourses,
  updateManagedCourse,
} from "@/services/server/courseService";
import { getOptionalUser, requireUser } from "@/services/server/authService";
import { CourseForm, CourseLevel } from "@/types/course";

function parseCourseForm(body: Record<string, unknown>): CourseForm {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  assertApi(title, 400, "กรุณากรอกชื่อหลักสูตร");

  return {
    title,
    description: typeof body.description === "string" ? body.description : "",
    price: Math.max(0, Number(body.price) || 0),
    category: typeof body.category === "string" ? body.category : "",
    level: (["beginner", "intermediate", "advanced"].includes(
      String(body.level)
    )
      ? body.level
      : "beginner") as CourseLevel,
    thumbnail: typeof body.thumbnail === "string" ? body.thumbnail : "",
    thumbnailPublicId:
      typeof body.thumbnailPublicId === "string" ? body.thumbnailPublicId : "",
    published: Boolean(body.published),
  };
}

function assertOwnedCover(
  publicId: string,
  userId: string,
  scope: "admin" | "teacher" = "teacher"
) {
  assertApi(
    isImageInFolder(
      publicId,
      scope === "admin"
        ? "lms2026/course-covers"
        : `lms2026/course-covers/${userId}`
    ),
    400,
    "รูปปกหลักสูตรไม่ถูกต้อง"
  );
}

export function getPublicCoursesAction() {
  return listPublicCourses();
}

export async function getPublicCourseAction(courseId: string) {
  assertApi(isValidObjectId(courseId), 404, "ไม่พบหลักสูตร");
  const user = await getOptionalUser();
  const result = await getPublicCourse(
    courseId,
    user?.role === "student" ? user.id : undefined
  );
  assertApi(result, 404, "ไม่พบหลักสูตร");
  return result;
}

export async function getStudentCoursesAction() {
  const user = await requireUser(["student"]);
  return listStudentCourses(user.id);
}

export async function getManagedCoursesAction(
  scope: "admin" | "teacher"
) {
  const user = await requireUser([scope]);
  return listManagedCourses(scope, user.id);
}

export async function createTeacherCourseAction(body: Record<string, unknown>) {
  const user = await requireUser(["teacher"]);
  const payload = parseCourseForm(body);
  assertOwnedCover(payload.thumbnailPublicId, user.id);
  return createCourseForTeacher(user.id, payload);
}

export async function updateCourseAction(
  scope: "admin" | "teacher",
  courseId: string,
  body: Record<string, unknown>
) {
  const user = await requireUser([scope]);
  assertApi(isValidObjectId(courseId), 404, "ไม่พบหลักสูตร");
  const payload = parseCourseForm(body);
  assertOwnedCover(payload.thumbnailPublicId, user.id, scope);
  const course = await updateManagedCourse(
    scope === "teacher" ? { _id: courseId, teacher: user.id } : { _id: courseId },
    payload
  );
  assertApi(course, 404, "ไม่พบหลักสูตร หรือไม่มีสิทธิ์แก้ไข");
  return course;
}

export async function deleteCourseAction(
  scope: "admin" | "teacher",
  courseId: string
) {
  const user = await requireUser([scope]);
  assertApi(isValidObjectId(courseId), 404, "ไม่พบหลักสูตร");
  const course = await deleteManagedCourse(
    scope === "teacher" ? { _id: courseId, teacher: user.id } : { _id: courseId }
  );
  assertApi(course, 404, "ไม่พบหลักสูตร หรือไม่มีสิทธิ์ลบ");
  return { message: "ลบหลักสูตรสำเร็จ" };
}
