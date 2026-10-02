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
          <Link href="/courses">หลักสูตร</Link>
          <Link href="/cart">รถเข็น</Link>

          {role === "admin" && (
            <>
              <Link href="/admin/users">จัดการผู้ใช้</Link>
              <Link href="/admin/categories">หมวดหมู่หลักสูตร</Link>
              <Link href="/admin/courses">จัดการหลักสูตร</Link>
              <Link href="/admin/coupons">คูปอง</Link>
            </>
          )}

          {role === "teacher" && (
            <>
              <Link href="/teacher/courses">หลักสูตรของฉัน</Link>
              <Link href="/teacher/assignments">งานที่มอบหมาย</Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/student/courses">หลักสูตรทั้งหมด</Link>
              <Link href="/student/my-courses">การเรียนรู้ของฉัน</Link>
            </>
          )}

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="text-sm text-slate-600 hover:text-blue-600">
                คำสั่งซื้อ
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                {session.user?.image ? (
                  <span
                    role="img"
                    aria-label={session.user.name || "รูปโปรไฟล์"}
                    className="h-9 w-9 rounded-full object-cover"
                    style={{
                      backgroundImage: `url(${JSON.stringify(session.user.image)})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {(session.user?.name || session.user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
                <span>
                  {session.user?.name || "โปรไฟล์"} ({role})
                </span>
              </Link>

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
