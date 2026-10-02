import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

type Props = {
  courses: Course[];
  role: "admin" | "teacher" | "student" | "public";
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
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
        ยังไม่มีหลักสูตร
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

