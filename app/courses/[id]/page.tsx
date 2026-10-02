"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { enrollCourse } from "@/services/client/enrollmentService";
import { rateCourse } from "@/services/client/courseService";
import { addCourseToCart, isCourseInCart } from "@/services/client/cartService";
import { Course } from "@/types/course";

type LessonPreview = {
  _id: string;
  title: string;
  order?: number;
  durationMinutes?: number;
};

type CourseDetail = {
  course: Course;
  lessons: LessonPreview[];
  isEnrolled: boolean;
  userRating: number;
};

export default function PublicCourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const courseId = params.id;
  const enrollmentStarted = useRef(false);
  const [data, setData] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/courses/${courseId}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "โหลดหลักสูตรไม่สำเร็จ");
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "โหลดหลักสูตรไม่สำเร็จ");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setInCart(isCourseInCart(courseId));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [courseId]);

  const submitEnrollment = useCallback(async () => {
    try {
      setEnrolling(true);
      const result = await enrollCourse(courseId);
      alert(result.message);
      router.push("/student/my-courses");
    } catch (err) {
      const message = err instanceof Error ? err.message : "สมัครเรียนไม่สำเร็จ";
      if (message.includes("ลงทะเบียนหลักสูตรนี้แล้ว")) {
        router.push("/student/my-courses");
      } else {
        alert(message);
      }
    } finally {
      setEnrolling(false);
    }
  }, [courseId, router]);

  function handleEnroll() {
    if (status !== "authenticated") {
      const callbackUrl = `/courses/${courseId}?enroll=1`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (session.user.role !== "student") {
      alert("การสมัครเรียนใช้ได้เฉพาะบัญชีผู้เรียนเท่านั้น");
      return;
    }

    void submitEnrollment();
  }

  useEffect(() => {
    if (
      status !== "authenticated" ||
      session.user.role !== "student" ||
      enrollmentStarted.current ||
      new URLSearchParams(window.location.search).get("enroll") !== "1"
    ) {
      return;
    }

    enrollmentStarted.current = true;
    window.history.replaceState(null, "", `/courses/${courseId}`);
    void submitEnrollment();
  }, [courseId, session, status, submitEnrollment]);

  if (loading) {
    return <main className="min-h-screen bg-slate-50 p-10 text-center text-slate-500">กำลังโหลดหลักสูตร...</main>;
  }

  if (error || !data) {
    return <main className="min-h-screen bg-slate-50 p-10 text-center text-red-600">{error || "ไม่พบหลักสูตร"}</main>;
  }

  const { course, lessons } = data;
  const category = typeof course.category === "object" ? course.category?.name : course.category;
  const teacher = typeof course.teacher === "object" ? course.teacher?.name : "";
  const rating = course.ratingAverage || 0;
  const duration = course.totalDurationMinutes || 0;
  const durationText =
    duration >= 60
      ? `${Math.floor(duration / 60)} ชั่วโมง ${duration % 60 ? `${duration % 60} นาที` : ""}`
      : `${duration} นาที`;

  function handleAddToCart() {
    addCourseToCart(course);
    setInCart(true);
  }

  async function handleRating(value: number) {
    try {
      setRatingLoading(true);
      const result = await rateCourse(courseId, value);
      setData((current) =>
        current
          ? {
              ...current,
              userRating: result.userRating,
              course: {
                ...current.course,
                ratingAverage: result.ratingAverage,
                ratingCount: result.ratingCount,
              },
            }
          : current
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "บันทึกคะแนนไม่สำเร็จ");
    } finally {
      setRatingLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2 text-sm">
              {course.isBestSeller && <span className="bg-amber-300 px-3 py-1 font-bold text-amber-950">ขายดี</span>}
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-200">{category || "ทั่วไป"}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{course.level}</span>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{course.description || "ยังไม่มีรายละเอียดหลักสูตร"}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="font-semibold text-amber-400">{rating.toFixed(1)} ★★★★★ ({course.ratingCount || 0} คะแนน)</span>
              <span>ผู้เรียน {course.enrollmentCount || 0} คน</span>
              <span>สอนโดย {teacher || "ทีมผู้สอน"}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
            {course.thumbnail ? (
              <div className="h-56 bg-cover bg-center" role="img" aria-label={course.title} style={{ backgroundImage: `url(${JSON.stringify(course.thumbnail)})` }} />
            ) : (
              <div className="flex h-56 items-center justify-center bg-slate-200 text-slate-500">ไม่มีรูปปก</div>
            )}
            <div className="p-6">
              <p className="text-2xl font-bold text-green-600">{course.price ? `${course.price.toLocaleString()} บาท` : "เรียนฟรี"}</p>
              <button onClick={handleAddToCart} disabled={inCart} className="mt-5 w-full rounded-xl border-2 border-violet-700 px-6 py-3 font-bold text-violet-700 transition hover:bg-violet-50 disabled:border-green-600 disabled:bg-green-50 disabled:text-green-700">
                {inCart ? "อยู่ในรถเข็นแล้ว" : "เพิ่มไปยังรถเข็น"}
              </button>
              <button onClick={handleEnroll} disabled={enrolling || status === "loading"} className="mt-5 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-slate-400">
                {enrolling ? "กำลังสมัครเรียน..." : status === "authenticated" ? "สมัครเรียน" : "Login เพื่อสมัครเรียน"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">ดูรายละเอียดได้ฟรี เข้าสู่ระบบเมื่อต้องการสมัครเรียน</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">เนื้อหาในหลักสูตร</h2>
          <p className="mt-2 text-slate-500">ทั้งหมด {lessons.length} บทเรียน</p>
          <div className="mt-6 space-y-3">
            {lessons.length ? lessons.map((lesson, index) => (
              <div key={lesson._id} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{lesson.order || index + 1}</span>
                <h3 className="font-semibold text-slate-800">{lesson.title}</h3>
              </div>
            )) : <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">ยังไม่มีบทเรียน</p>}
          </div>
        </div>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">ข้อมูลหลักสูตร</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">ระดับ</dt><dd className="font-medium">{course.level}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">บทเรียน</dt><dd className="font-medium">{lessons.length} บท</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">วิดีโอทั้งหมด</dt><dd className="font-medium">{durationText}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">บทบรรยาย</dt><dd className="font-medium">{course.lectureCount || lessons.length} บท</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">ผู้สอน</dt><dd className="font-medium text-right">{teacher || "ทีมผู้สอน"}</dd></div>
          </dl>
          {data.isEnrolled && (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm font-semibold text-slate-800">ให้คะแนนหลักสูตรนี้</p>
              <div className="mt-3 flex gap-1" aria-label="ให้คะแนน 1 ถึง 5 ดาว">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={ratingLoading}
                    onClick={() => void handleRating(value)}
                    className={`text-2xl transition hover:scale-110 disabled:opacity-50 ${
                      value <= data.userRating ? "text-amber-500" : "text-slate-300"
                    }`}
                    aria-label={`${value} ดาว`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
