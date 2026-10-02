"use client";

import { LessonForm as LessonFormType } from "@/types/lesson";

type Props = {
  form: LessonFormType;
  loading?: boolean;
  uploading?: boolean;
  onChange: (form: LessonFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
  onUploadVideo: (file: File) => void;
  onUploadPdf: (file: File) => void;
};

export default function LessonForm({
  form,
  loading,
  uploading,
  onChange,
  onSubmit,
  onUploadVideo,
  onUploadPdf,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow p-6"
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        placeholder="ชื่อบทเรียน"
        value={form.title}
        onChange={(e) =>
          onChange({ ...form, title: e.target.value })
        }
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        type="number"
        min={0}
        placeholder="ระยะเวลาบทเรียน (นาที)"
        value={form.durationMinutes}
        onChange={(e) =>
          onChange({ ...form, durationMinutes: Number(e.target.value) })
        }
      />

      <textarea
        className="w-full border rounded-xl px-4 py-3 mb-3"
        rows={6}
        placeholder="เนื้อหาบทเรียน"
        value={form.content}
        onChange={(e) =>
          onChange({ ...form, content: e.target.value })
        }
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        type="number"
        min={1}
        placeholder="ลำดับบทเรียน"
        value={form.order}
        onChange={(e) =>
          onChange({ ...form, order: Number(e.target.value) })
        }
      />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <label className="border rounded-xl px-4 py-3 cursor-pointer">
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลด Video"}
          <input
            type="file"
            hidden
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadVideo(file);
            }}
          />
        </label>

        <label className="border rounded-xl px-4 py-3 cursor-pointer">
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลด PDF"}
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadPdf(file);
            }}
          />
        </label>
      </div>

      {form.videoUrl && (
        <video
          src={form.videoUrl}
          controls
          className="w-full rounded-xl mb-4"
        />
      )}

      {form.pdfUrl && (
        <a
          href={form.pdfUrl}
          target="_blank"
          className="block text-blue-600 underline mb-4"
        >
          เปิดไฟล์ PDF
        </a>
      )}

      <button
        disabled={loading || uploading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
      >
        {loading ? "กำลังบันทึก..." : "บันทึกบทเรียน"}
      </button>
    </form>
  );
}
