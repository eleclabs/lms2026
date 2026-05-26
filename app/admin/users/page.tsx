"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  async function updateRole(userId: string, role: string) {
    await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        role,
      }),
    });

    loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        จัดการผู้ใช้
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user._id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="admin">admin</option>
                    <option value="teacher">teacher</option>
                    <option value="student">student</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

