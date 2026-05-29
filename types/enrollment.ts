import { Course } from "./course";

export type Enrollment = {
  _id: string;
  student: string;
  course: Course;
  progress: number;
  createdAt?: string;
};