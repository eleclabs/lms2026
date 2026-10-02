"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseCatalogPage from "@/components/courses/CourseCatalogPage";

function PublicCatalog() {
  const searchParams = useSearchParams();
  return (
    <CourseCatalogPage
      scope="public"
      title="หลักสูตรทั้งหมด"
      description="เลือกดูรายละเอียดหลักสูตร ผู้สอน คะแนน และสมัครเรียน"
      initialQuery={searchParams.get("q") || ""}
    />
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">กำลังโหลดหลักสูตร...</div>}>
      <PublicCatalog />
    </Suspense>
  );
}
