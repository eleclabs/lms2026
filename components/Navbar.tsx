"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          LMS System
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/courses">รายวิชา</Link>

          {role === "admin" && (
            <>
              <Link href="/admin/users">จัดการผู้ใช้</Link>
              <Link href="/admin/categories">หมวดหมู่รายวิชา</Link>
              <Link href="/admin/courses">จัดการรายวิชา</Link>
            </>
          )}

          {role === "teacher" && (
            <>
              <Link href="/teacher/courses">รายวิชาของฉัน</Link>
              <Link href="/teacher/assignments">งานที่มอบหมาย</Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/student/courses">รายวิชาทั้งหมด</Link>
              <Link href="/student/my-courses">วิชาที่ลงทะเบียน</Link> 
            </>
          )}

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {session.user?.name} ({role})
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}