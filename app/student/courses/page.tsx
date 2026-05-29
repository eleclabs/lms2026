"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CourseGrid from "@/components/courses/CourseGrid";
import { Course } from "@/types/course";
import { getCourses } from "@/services/client/courseService";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  async function loadData() {
    try {
      const data = await getCourses("student");
      setCourses(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "โหลดรายวิชาไม่สำเร็จ");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="รายวิชาทั้งหมด"
          description="เลือกดูรายละเอียดและลงทะเบียนเรียน"
        />

        <CourseGrid courses={courses} role="student" />
      </div>
    </main>
  );
}

