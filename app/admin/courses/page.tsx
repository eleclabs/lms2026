"use client";

import { useEffect, useState } from "react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  async function loadCourses() {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
  }

  async function createCourse() {
    await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });

    setTitle("");
    loadCourses();
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        จัดการรายวิชา
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border rounded-xl px-4 py-3"
          placeholder="ชื่อรายวิชา"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={createCourse}
          className="bg-blue-600 text-white px-5 rounded-xl"
        >
          เพิ่มรายวิชา
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h2 className="font-bold text-lg">
              {course.title}
            </h2>
          </div>
        ))}
      </div>
    </main>
  );
}

