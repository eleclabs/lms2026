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
      className="bg-white rounded-2xl shadow p-6 mb-8"
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        placeholder="ชื่อบทเรียน"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full border rounded-xl px-4 py-3 mb-3"
        rows={5}
        placeholder="เนื้อหาบทเรียน"
        value={form.content}
        onChange={(e) => onChange({ ...form, content: e.target.value })}
      />

      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        type="number"
        value={form.order}
        onChange={(e) =>
          onChange({ ...form, order: Number(e.target.value) })
        }
      />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadVideo(file);
          }}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadPdf(file);
          }}
        />
      </div>

      <button
        disabled={loading || uploading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        {loading ? "กำลังบันทึก..." : "บันทึกบทเรียน"}
      </button>
    </form>
  );
}

