"use client";

import { Lesson } from "@/types/lesson";

type Props = {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  onSelect: (lesson: Lesson) => void;
};

export default function LessonLearnList({
  lessons,
  selectedLesson,
  onSelect,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-bold text-lg mb-4">บทเรียนทั้งหมด</h2>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <button
            key={lesson._id}
            onClick={() => onSelect(lesson)}
            className={`w-full text-left border rounded-xl p-3 hover:bg-blue-50 ${
              selectedLesson?._id === lesson._id
                ? "bg-blue-100 border-blue-500"
                : ""
            }`}
          >
            <p className="font-medium">
              {lesson.order}. {lesson.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

