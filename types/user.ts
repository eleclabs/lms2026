export type UserRole = "admin" | "teacher" | "student";

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  imagePublicId?: string;
  provider?: string;
  role: UserRole;
};
