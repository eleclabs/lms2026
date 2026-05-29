import {
  apiGet,
  apiPatch,
  apiDelete,
} from "@/services/core/httpService";

import {
  User,
  UserRole,
} from "@/types/user";

export function getUsers() {
  return apiGet<User[]>("/api/admin/users");
}

export function getMe() {
  return apiGet<User>("/api/users/me");
}

export function updateUserRole(
  userId: string,
  role: UserRole
) {
  return apiPatch<User>(
    "/api/admin/users/role",
    {
      userId,
      role,
    }
  );
}

export function deleteUser(userId: string) {
  return apiDelete<{ message: string }>(
    `/api/admin/users/${userId}`
  );
}

