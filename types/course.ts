import { Category } from "./category";
import { User } from "./user";

export type CourseLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type Course = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  category?: Category | string;
  level: CourseLevel;
  teacher?: User | string;
  thumbnail?: string;
  published: boolean;
};

export type CourseForm = {
  title: string;
  description: string;
  price: number;
  category: string;
  level: CourseLevel;
  thumbnail: string;
  published: boolean;
};

export const defaultCourseForm: CourseForm = {
  title: "",
  description: "",
  price: 0,
  category: "",
  level: "beginner",
  thumbnail: "",
  published: false,
};