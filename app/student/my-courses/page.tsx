"use client";

import { useEffect, useState } from "react";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  async function loadCourses() {
    const res = await fetch("/api/student/my-courses");
    const data = await res.json();

    setCourses(data);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        วิชาที่ลงทะเบียน
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h2 className="font-bold text-lg">
              {item.course.title}
            </h2>

            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <p className="text-sm mt-2">
                Progress {item.progress}%
              </p>
            </div>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl">
              เข้าเรียน
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

