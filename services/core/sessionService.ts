import { getSession } from "next-auth/react";

export async function getCurrentSession() {
  return getSession();
}

export async function getCurrentUser() {
  const session =
    await getCurrentSession();

  return session?.user || null;
}

export async function requireAuth() {
  const session =
    await getCurrentSession();

  if (!session) {
    throw new Error(
      "กรุณาเข้าสู่ระบบ"
    );
  }

  return session;
}

export async function requireRole(
  roles: string[]
) {
  const session =
    await requireAuth();

  if (
    !roles.includes(
      session.user.role
    )
  ) {
    throw new Error(
      "ไม่มีสิทธิ์เข้าถึง"
    );
  }

  return session;
}

