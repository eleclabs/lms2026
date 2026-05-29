export type Lesson = {
  _id: string;
  course: string;
  title: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  order?: number;
};

export type LessonForm = {
  courseId: string;
  title: string;
  content: string;
  videoUrl: string;
  pdfUrl: string;
  order: number;
};

export const defaultLessonForm: LessonForm = {
  courseId: "",
  title: "",
  content: "",
  videoUrl: "",
  pdfUrl: "",
  order: 1,
};

