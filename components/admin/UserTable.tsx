import { User, UserRole } from "@/types/user";

type Props = {
  users: User[];
  onRoleChange: (userId: string, role: UserRole) => void;
};

export default function UserTable({ users, onRoleChange }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">ชื่อ</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Provider</th>
            <th className="p-4 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.provider || "-"}</td>
              <td className="p-4">
                <select
                  value={user.role}
                  onChange={(e) =>
                    onRoleChange(user._id, e.target.value as UserRole)
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
  );
}

