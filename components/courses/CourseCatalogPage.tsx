"use client";

import { useMemo, useState } from "react";
import CourseGrid from "./CourseGrid";
import CourseLoadError from "./CourseLoadError";
import PageHeader from "@/components/shared/PageHeader";
import { useCourses } from "@/hooks/useCourses";
import { CourseScope } from "@/services/client/courseService";
import { courseMatchesQuery } from "@/services/shared/courseDiscovery";

type Props = {
  scope: Extract<CourseScope, "public" | "student">;
  title: string;
  description: string;
  initialQuery?: string;
  searchable?: boolean;
};

export default function CourseCatalogPage({
  scope,
  title,
  description,
  initialQuery = "",
  searchable = true,
}: Props) {
  const { courses, loading, error, reload } = useCourses(scope);
  const [query, setQuery] = useState(initialQuery);
  const filteredCourses = useMemo(
    () => courses.filter((course) => courseMatchesQuery(course, query)),
    [courses, query]
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader title={title} description={description} />

        {searchable && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor={`${scope}-course-search`} className="mb-2 block text-sm font-semibold text-slate-700">
              ค้นหาหลักสูตร
            </label>
            <input
              id={`${scope}-course-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชื่อหลักสูตร หมวดหมู่ หรือผู้สอน"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        <div className="mb-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">หลักสูตรทั้งหมด</h2>
          <p className="mt-1 text-slate-500">
            พบ {filteredCourses.length} จาก {courses.length} หลักสูตร
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500">กำลังโหลดหลักสูตร...</div>
        ) : error ? (
          <CourseLoadError
            message={error}
            onRetry={() => void reload().catch(() => undefined)}
          />
        ) : (
          <CourseGrid courses={filteredCourses} role={scope} />
        )}
      </div>
    </main>
  );
}
