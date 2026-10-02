import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/lib/api/errors";
import { UserRole } from "@/types/user";

export function getOptionalUser() {
  return getServerSession(authOptions).then((session) => session?.user || null);
}

export async function requireUser(roles?: UserRole[]) {
  const user = await getOptionalUser();

  if (!user) throw new ApiError(401, "กรุณาเข้าสู่ระบบ");
  if (roles && !roles.includes(user.role)) {
    throw new ApiError(403, "ไม่มีสิทธิ์เข้าถึง");
  }

  return user;
}
