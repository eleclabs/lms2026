"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import { getMyEnrollments } from "@/services/client/enrollmentService";
import { Enrollment } from "@/types/enrollment";

export default function StudentMyCoursesPage() {
  const [items, setItems] = useState<Enrollment[]>([]);

  useEffect(() => {
    let active = true;

    getMyEnrollments()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((error) => {
        if (active) {
          alert(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="หลักสูตรที่ลงทะเบียน"
          description="หลักสูตรที่คุณลงทะเบียนเรียนแล้ว"
        />

        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            ยังไม่ได้ลงทะเบียนหลักสูตร
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                {item.course.thumbnail ? (
                  <div
                    role="img"
                    aria-label={item.course.title}
                    className="h-40 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${JSON.stringify(item.course.thumbnail)})`,
                    }}
                  />
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Cover
                  </div>
                )}

                <div className="p-5">
                  <h2 className="font-bold text-lg">
                    {item.course.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {item.course.description || "ไม่มีรายละเอียด"}
                  </p>

                  <div className="mt-4">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <p className="text-sm mt-2">
                      Progress {item.progress}%
                    </p>
                  </div>

                  <Link
                    href={`/student/courses/${item.course._id}/learn`}
                    className="block text-center mt-5 bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    เข้าเรียน
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
