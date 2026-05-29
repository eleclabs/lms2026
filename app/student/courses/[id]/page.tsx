"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import { enrollCourse } from "@/services/client/enrollmentService";

type Lesson = {
  _id: string;
  title: string;
  content?: string;
  order?: number;
};

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    const res = await fetch(`/api/student/courses/${courseId}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      setCourse(data.course);
      setLessons(data.lessons || []);
    } else {
      alert(data.message);
    }
  }

  async function handleEnroll() {
    try {
      setLoading(true);

      const data = await enrollCourse(courseId);

      alert(data.message);
      router.push("/student/my-courses");
    } catch (error) {
      alert(error instanceof Error ? error.message : "ลงทะเบียนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!course) {
    return (
      <main className="p-8">
        <p>กำลังโหลดข้อมูล...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title={course.title}
          description="รายละเอียดรายวิชาและบทเรียน"
        />

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex gap-2 mb-4">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {course.category?.name || "ทั่วไป"}
              </span>

              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {course.level}
              </span>
            </div>

            <p className="text-gray-700 mb-6">
              {course.description || "ไม่มีรายละเอียด"}
            </p>

            <button
              disabled={loading}
              onClick={handleEnroll}
              className="bg-green-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
            >
              {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียนเรียน"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">เนื้อหาบทเรียน</h2>

          {lessons.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีบทเรียน</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-bold">
                    {lesson.order}. {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {lesson.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

