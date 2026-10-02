"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import LessonForm from "@/components/lessons/LessonForm";

import {
  defaultLessonForm,
  LessonForm as LessonFormType,
} from "@/types/lesson";

import { createLesson } from "@/services/client/lessonService";
import { uploadLessonFile } from "@/services/core/uploadService";

export default function NewLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [form, setForm] = useState<LessonFormType>({
    ...defaultLessonForm,
    courseId,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleUploadVideo(file: File) {
    try {
      setUploading(true);

      const url = await uploadLessonFile(file);

      setForm((prev) => ({
        ...prev,
        videoUrl: url,
      }));
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "อัปโหลดวิดีโอไม่สำเร็จ"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleUploadPdf(file: File) {
    try {
      setUploading(true);

      const url = await uploadLessonFile(file);

      setForm((prev) => ({
        ...prev,
        pdfUrl: url,
      }));
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "อัปโหลด PDF ไม่สำเร็จ"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("กรุณากรอกชื่อบทเรียน");
      return;
    }

    try {
      setLoading(true);

      await createLesson(form);

      alert("เพิ่มบทเรียนสำเร็จ");

      router.push(`/teacher/courses/${courseId}/lessons`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "เพิ่มบทเรียนไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="เพิ่มบทเรียนใหม่"
          description="เพิ่มเนื้อหา วิดีโอ หรือเอกสารประกอบการเรียน"
        />

        <LessonForm
          form={form}
          loading={loading}
          uploading={uploading}
          onChange={setForm}
          onSubmit={handleSubmit}
          onUploadVideo={handleUploadVideo}
          onUploadPdf={handleUploadPdf}
        />
      </div>
    </main>
  );
}

