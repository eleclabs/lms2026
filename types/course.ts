export type Category = {
  _id: string;
  name: string;
};

export type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: Category | string;
  level?: string;
  thumbnail?: string;
  published?: boolean;
};

export type CourseForm = {
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  published: boolean;
};
