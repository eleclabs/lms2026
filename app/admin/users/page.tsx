"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import UserTable from "@/components/admin/UserTable";
import { User, UserRole } from "@/types/user";
import { getUsers, updateUserRole } from "@/services/client/userService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    setUsers(await getUsers());
  }

  async function handleRoleChange(userId: string, role: UserRole) {
    await updateUserRole(userId, role);
    await loadUsers();
  }

  useEffect(() => {
    let active = true;

    getUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((error) => {
        console.error("Failed to load users", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <PageHeader
        title="จัดการผู้ใช้"
        description="กำหนดสิทธิ์ Admin / Teacher / Student"
      />

      {users.length > 0 ? (
        <UserTable users={users} onRoleChange={handleRoleChange} />
      ) : (
        <EmptyState message="ยังไม่มีผู้ใช้" />
      )}
    </main>
  );
}

