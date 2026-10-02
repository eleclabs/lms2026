"use client";

import { Lesson } from "@/types/lesson";

type Props = {
  lessons: Lesson[];
  onDelete: (lessonId: string) => void;
};

export default function TeacherLessonList({
  lessons,
  onDelete,
}: Props) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
        ยังไม่มีบทเรียน
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson) => (
        <div
          key={lesson._id}
          className="bg-white rounded-2xl shadow p-5 flex justify-between gap-4"
        >
          <div>
            <h2 className="font-bold text-lg">
              {lesson.order}. {lesson.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {lesson.content || "ไม่มีรายละเอียด"}
            </p>

            <div className="flex gap-2 mt-3 text-xs">
              {lesson.videoUrl && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  Video
                </span>
              )}

              {lesson.pdfUrl && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  PDF
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onDelete(lesson._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl h-fit"
          >
            ลบ
          </button>
        </div>
      ))}
    </div>
  );
}
