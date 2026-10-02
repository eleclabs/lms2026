"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseLoadError from "@/components/courses/CourseLoadError";
import { useCourses } from "@/hooks/useCourses";
import {
  getRecommendedCourses,
  getTopRatedCourses,
} from "@/services/shared/courseDiscovery";

export default function HomePage() {
  const { courses, loading, error, reload } = useCourses("public");
  const [query, setQuery] = useState("");

  const recommended = useMemo(
    () => getRecommendedCourses(courses),
    [courses]
  );

  const topRated = useMemo(
    () =>
      getTopRatedCourses(courses),
    [courses]
  );

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    window.location.href = value ? `/courses?q=${encodeURIComponent(value)}` : "/courses";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-36 left-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
            เรียนรู้ได้ทุกที่ ทุกเวลา
          </span>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            พัฒนาทักษะใหม่กับหลักสูตรที่ออกแบบเพื่อคุณ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            ค้นหาหลักสูตรจากผู้สอนคุณภาพ เริ่มเรียนตามจังหวะของตัวเอง และติดตามความก้าวหน้าได้ในที่เดียว
          </p>
          <form onSubmit={handleSearch} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="อยากเรียนเรื่องอะไร?"
              className="min-w-0 flex-1 rounded-xl px-5 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700">
              ค้นหาหลักสูตร
            </button>
          </form>
          <div className="mt-9 flex flex-wrap justify-center gap-8 text-sm text-slate-300">
            <span><strong className="text-xl text-white">{courses.length}</strong> หลักสูตร</span>
            <span><strong className="text-xl text-white">{courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)}</strong> การสมัครเรียน</span>
            <span><strong className="text-xl text-white">เรียนได้ทันที</strong> หลังสมัคร</span>
          </div>
        </div>
      </section>

      {error && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <CourseLoadError
            message={error}
            onRetry={() => void reload().catch(() => undefined)}
          />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">เลือกมาเพื่อคุณ</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">หลักสูตรที่แนะนำ</h2>
          </div>
          <Link href="/courses" className="font-semibold text-blue-600 hover:text-blue-700">ดูทั้งหมด →</Link>
        </div>
        {loading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500">กำลังโหลด...</div> : <CourseGrid courses={recommended} role="public" />}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-7">
            <p className="text-sm font-semibold text-amber-600">ผู้เรียนให้คะแนนสูง</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">หลักสูตรคะแนนสูง</h2>
          </div>
          {loading ? <div className="p-10 text-center text-slate-500">กำลังโหลด...</div> : <CourseGrid courses={topRated} role="public" />}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl bg-blue-600 px-8 py-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold">พร้อมเริ่มเรียนแล้วหรือยัง?</h2>
            <p className="mt-2 text-blue-100">เลือกหลักสูตรที่สนใจและเริ่มพัฒนาตัวเองได้วันนี้</p>
          </div>
          <Link href="/courses" className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700">ดูหลักสูตรทั้งหมด</Link>
        </div>
      </section>
    </main>
  );
}
