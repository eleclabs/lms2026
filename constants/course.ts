import { CourseForm } from "@/types/course";

export const defaultCourseForm: CourseForm = {
  title: "",
  description: "",
  category: "",
  level: "beginner",
  thumbnail: "",
  published: false,
};

export const courseLevels = [
  { value: "beginner", label: "เริ่มต้น" },
  { value: "intermediate", label: "ปานกลาง" },
  { value: "advanced", label: "ขั้นสูง" },
];

