import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

type Props = {
  courses: Course[];
  role: "admin" | "teacher" | "student";
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
};

export default function CourseGrid({
  courses,
  role,
  onEdit,
  onDelete,
}: Props) {
  if (courses.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        ยังไม่มีรายวิชา
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
        />       

      ))}
    </div>
  );
}

