"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function TeacherLessonsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    pdfUrl: "",
    order: 1,
  });

  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File, type: "video" | "pdf") {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (type === "video") {
      setForm((prev) => ({
        ...prev,
        videoUrl: data.url,
      }));
    }

    if (type === "pdf") {
      setForm((prev) => ({
        ...prev,
        pdfUrl: data.url,
      }));
    }
  }

  async function createLesson(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/teacher/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        ...form,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("เพิ่มบทเรียนสำเร็จ");
      setForm({
        title: "",
        content: "",
        videoUrl: "",
        pdfUrl: "",
        order: 1,
      });
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">เพิ่มบทเรียน</h1>

      <form
        onSubmit={createLesson}
        className="bg-white rounded-2xl shadow p-6 max-w-2xl"
      >
        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="ชื่อบทเรียน"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="รายละเอียดบทเรียน"
          rows={5}
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          type="number"
          placeholder="ลำดับบทเรียน"
          value={form.order}
          onChange={(e) =>
            setForm({
              ...form,
              order: Number(e.target.value),
            })
          }
        />

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Upload Video
          </label>

          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, "video");
            }}
          />

          {form.videoUrl && (
            <video
              src={form.videoUrl}
              controls
              className="mt-3 w-full rounded-xl"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Upload PDF
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, "pdf");
            }}
          />

          {form.pdfUrl && (
            <a
              href={form.pdfUrl}
              target="_blank"
              className="block mt-3 text-blue-600 underline"
            >
              เปิดไฟล์ PDF
            </a>
          )}
        </div>

        <button
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
        >
          {uploading ? "กำลัง Upload..." : "บันทึกบทเรียน"}
        </button>
      </form>
    </main>
  );
}