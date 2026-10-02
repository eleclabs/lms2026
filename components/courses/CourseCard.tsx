import Link from "next/link";
import { Course } from "@/types/course";

type Props = {
  course: Course;
  role: "admin" | "teacher" | "student" | "public";
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
};

export default function CourseCard({ course, role, onEdit, onDelete }: Props) {
  const detailHref = `/courses/${course._id}`;
  const canOpenDetail = role === "public" || role === "student";
  const categoryName =
    typeof course.category === "object"
      ? course.category?.name
      : course.category;

  const priceText =
    course.price && course.price > 0
      ? `${course.price.toLocaleString()} บาท`
      : "ฟรี";

  const rating = course.ratingAverage || 0;
  const fullStars = Math.round(rating);
  const duration = course.totalDurationMinutes || 0;
  const durationText =
    duration >= 60
      ? `${Math.floor(duration / 60)} ชม. ${duration % 60 ? `${duration % 60} นาที` : ""}`
      : `${duration} นาที`;

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {course.thumbnail ? (
        canOpenDetail ? (
          <Link href={detailHref} className="block overflow-hidden">
            <div
              role="img"
              aria-label={course.title}
              className="h-40 w-full bg-cover bg-center transition duration-300 hover:scale-105"
              style={{ backgroundImage: `url(${JSON.stringify(course.thumbnail)})` }}
            />
          </Link>
        ) : (
        <div
          role="img"
          aria-label={course.title}
          className="h-40 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(course.thumbnail)})` }}
        />
        )
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

        {course.isBestSeller && (
          <span className="mb-2 inline-flex bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900">
            ขายดี
          </span>
        )}

        <h2 className="line-clamp-2 min-h-14 text-lg font-bold leading-7">
          {canOpenDetail ? (
            <Link href={detailHref} className="hover:text-blue-600 hover:underline">
              {course.title}
            </Link>
          ) : (
            course.title
          )}
        </h2>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {course.description || "ไม่มีรายละเอียด"}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {typeof course.teacher === "object" ? course.teacher?.name : "ทีมผู้สอน"}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 font-bold text-amber-700">
            {rating > 0 ? rating.toFixed(1) : "0.0"}{" "}
            <span aria-label={`${rating.toFixed(1)} ดาว`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= fullStars ? "text-amber-500" : "text-slate-300"}>★</span>
              ))}
            </span>{" "}
            <span className="font-normal text-slate-500">({course.ratingCount || 0})</span>
          </span>
          <span className="shrink-0 text-base font-bold text-slate-900">
            {priceText}
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {durationText} · {course.lectureCount || 0} บทบรรยาย · ผู้เรียน {course.enrollmentCount || 0} คน
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

          {role === "public" && (
            <Link
              href={`/courses/${course._id}`}
              className="text-center bg-blue-600 text-white px-3 py-2 rounded-xl text-sm col-span-3"
            >
              ดูรายละเอียด
            </Link>
          )}

          {role === "student" && course.enrolled && (
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                <span>Enrolled</span>
                <span>Progress {course.enrollmentProgress || 0}%</span>
              </div>
              <Link
                href={`/student/courses/${course._id}/learn`}
                className="block rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                ไปที่หลักสูตร
              </Link>
            </div>
          )}

          {role === "student" && !course.enrolled && (
            <Link
              href={`/courses/${course._id}`}
              className="col-span-3 rounded-xl bg-blue-600 px-3 py-2 text-center text-sm text-white transition hover:bg-blue-700"
            >
              ดูรายละเอียดและสมัครเรียน
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

