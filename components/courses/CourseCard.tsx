import Link from "next/link";
import { Course } from "@/types/course";

type Props = {
  course: Course;
  role: "admin" | "teacher" | "student";
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
};

export default function CourseCard({ course, role, onEdit, onDelete }: Props) {
  const categoryName =
    typeof course.category === "object"
      ? course.category?.name
      : course.category;

  const priceText =
    course.price && course.price > 0
      ? `${course.price.toLocaleString()} บาท`
      : "ฟรี";

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {categoryName || "ไม่ระบุหมวดหมู่"}
          </span>

          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
            {course.level || "beginner"}
          </span>
        </div>

        <h2 className="font-bold text-lg">{course.title}</h2>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {course.description || "ไม่มีรายละเอียด"}
        </p>

        <p className="text-sm font-semibold text-green-600 mt-2">
          {priceText}
        </p>

        <p
          className={`text-sm mt-2 ${
            course.published ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {course.published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
        </p>

        <div className="grid grid-cols-3 gap-2 mt-5">
          {role === "teacher" && (
            <Link
              href={`/teacher/courses/${course._id}/lessons`}
              className="text-center bg-blue-600 text-white px-3 py-2 rounded-xl text-sm"
            >
              บทเรียน
            </Link>
          )}

          {role === "student" && (
            <Link
              href={`/student/courses/${course._id}`}
              className="text-center bg-blue-600 text-white px-3 py-2 rounded-xl text-sm col-span-3"
            >
              ดูรายละเอียด
            </Link>
          )}

          {(role === "admin" || role === "teacher") && onEdit && (
            <button
              onClick={() => onEdit(course)}
              className="bg-yellow-500 text-white px-3 py-2 rounded-xl text-sm"
            >
              แก้ไข
            </button>
          )}

          {(role === "admin" || role === "teacher") && onDelete && (
            <button
              onClick={() => onDelete(course._id)}
              className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
            >
              ลบ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

