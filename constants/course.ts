import { CourseForm } from "@/types/course";

export const defaultCourseForm: CourseForm = {
  title: "",
  description: "",
  price: 0,
  category: "",
  level: "beginner",
  thumbnail: "",
  thumbnailPublicId: "",
  published: false,

};

export const courseLevels = [
  { value: "beginner", label: "เริ่มต้น" },
  { value: "intermediate", label: "ปานกลาง" },
  { value: "advanced", label: "ขั้นสูง" },
];

