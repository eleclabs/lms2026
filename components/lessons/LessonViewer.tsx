"use client";

import { Lesson } from "@/types/lesson";

type Props = {
  lesson: Lesson | null;
};

export default function LessonViewer({ lesson }: Props) {
  if (!lesson) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
        กรุณาเลือกบทเรียน
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

      {lesson.videoUrl && (
        <video
          src={lesson.videoUrl}
          controls
          className="w-full rounded-xl mb-5"
        />
      )}

      {lesson.content && (
        <div className="prose max-w-none mb-5 whitespace-pre-line">
          {lesson.content}
        </div>
      )}

      {lesson.pdfUrl && (
        <a
          href={lesson.pdfUrl}
          target="_blank"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          เปิดเอกสาร PDF
        </a>
      )}
    </div>
  );
}

