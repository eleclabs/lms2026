"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import TeacherLessonList from "@/components/lessons/TeacherLessonList";
import { deleteLesson, getTeacherCourseWithLessons } from "@/services/client/lessonService";
import { Course } from "@/types/course";
import { Lesson } from "@/types/lesson";

export default function TeacherLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getTeacherCourseWithLessons(courseId);
      setCourse(data.course);
      setLessons(data.lessons || []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "โหลดบทเรียนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("ต้องการลบบทเรียนนี้ใช่หรือไม่?")) return;

    try {
      await deleteLesson(lessonId);
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ลบบทเรียนไม่สำเร็จ");
    }
  }

  useEffect(() => {
    if (!courseId) return;

    let active = true;

    getTeacherCourseWithLessons(courseId)
      .then((data) => {
        if (!active) return;
        setCourse(data.course);
        setLessons(data.lessons || []);
      })
      .catch((error) => {
        if (active) {
          alert(error instanceof Error ? error.message : "โหลดบทเรียนไม่สำเร็จ");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title={course ? course.title : "รายละเอียดหลักสูตร"}
          description={
            course
              ? course.description || "ไม่มีรายละเอียดเพิ่มเติม"
              : "กำลังโหลดข้อมูล..."
          }
          actionLabel="+ เพิ่มบทเรียน"
          onAction={() =>
            router.push(`/teacher/courses/${courseId}/lessons/new`)
          }
        />

        <div className="mb-4">
          <h2 className="text-2xl font-bold">หัวข้อเนื้อหา</h2>
          <p className="text-gray-500">รายการบทเรียนทั้งหมดในหลักสูตรนี้</p>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-gray-500">
            กำลังโหลดบทเรียน...
          </div>
        ) : (
          <TeacherLessonList lessons={lessons} onDelete={handleDeleteLesson} />
        )}
      </div>
    </main>
  );
}
