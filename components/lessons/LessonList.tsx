import { Lesson } from "@/types/lesson";

type Props = {
  lessons: Lesson[];
  onDelete?: (lessonId: string) => void;
};

export default function LessonList({ lessons, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {lessons.map((lesson) => (
        <div
          key={lesson._id}
          className="bg-white rounded-2xl shadow p-5 flex justify-between"
        >
          <div>
            <h2 className="font-bold">
              {lesson.order}. {lesson.title}
            </h2>
            <p className="text-sm text-gray-500">{lesson.content}</p>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(lesson._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              ลบ
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

