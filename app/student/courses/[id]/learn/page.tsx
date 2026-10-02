"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import LessonLearnList from "@/components/lessons/LessonLearnList";
import LessonViewer from "@/components/lessons/LessonViewer";

import { Lesson } from "@/types/lesson";
import { getStudentLessonsByCourse } from "@/services/client/lessonService";

export default function StudentLearnPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    let active = true;

    getStudentLessonsByCourse(courseId)
      .then((data) => {
        if (!active) return;
        setLessons(data);
        setSelectedLesson(data[0] || null);
      })
      .catch((error) => {
        if (active) {
          alert(
            error instanceof Error
              ? error.message
              : "โหลดบทเรียนไม่สำเร็จ"
          );
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
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="เข้าเรียน"
          description="เลือกบทเรียนและดูเนื้อหาของหลักสูตร"
        />

        {loading ? (
          <div className="text-center text-gray-500 mt-10">
            กำลังโหลดบทเรียน...
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            ยังไม่มีบทเรียนในหลักสูตรนี้
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <LessonLearnList
                lessons={lessons}
                selectedLesson={selectedLesson}
                onSelect={setSelectedLesson}
              />
            </div>

            <div className="md:col-span-3">
              <LessonViewer lesson={selectedLesson} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

