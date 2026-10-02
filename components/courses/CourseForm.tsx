import { Category } from "@/types/category";
import { CourseForm as CourseFormType } from "@/types/course";

type Props = {
  form: CourseFormType;
  categories: Category[];
  loading?: boolean;
  uploading?: boolean;
  editing?: boolean;
  onChange: (form: CourseFormType) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onUpload: (file: File) => void;
};

export default function CourseForm({
  form,
  categories,
  loading,
  uploading,
  editing,
  onChange,
  onSubmit,
  onCancel,
  onUpload,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "แก้ไขหลักสูตร" : "เพิ่มหลักสูตรใหม่"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border rounded-xl px-4 py-3"
          placeholder="ชื่อหลักสูตร"
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
        />

        <input
          className="border rounded-xl px-4 py-3"
          type="number"
          min={0}
          placeholder="ราคา"
          value={form.price}
          onChange={(e) =>
            onChange({ ...form, price: Number(e.target.value) })
          }
        />

        <select
          className="border rounded-xl px-4 py-3"
          value={form.category}
          onChange={(e) => onChange({ ...form, category: e.target.value })}
        >
          <option value="">เลือกหมวดหมู่</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-xl px-4 py-3"
          value={form.level}
          onChange={(e) =>
            onChange({
              ...form,
              level: e.target.value as CourseFormType["level"],
            })
          }
        >
          <option value="beginner">เริ่มต้น</option>
          <option value="intermediate">ปานกลาง</option>
          <option value="advanced">ขั้นสูง</option>
        </select>

        <input
          className="border rounded-xl px-4 py-3"
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={(e) =>
            onChange({
              ...form,
              thumbnail: e.target.value,
              thumbnailPublicId: "",
            })
          }
        />

        <label className="border rounded-xl px-4 py-3 cursor-pointer bg-white">
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
      </div>

      {form.thumbnail && (
        <div
          role="img"
          aria-label="ตัวอย่างรูปปกหลักสูตร"
          className="mt-4 h-48 w-full rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(form.thumbnail)})` }}
        />
      )}

      <textarea
        className="w-full border rounded-xl px-4 py-3 mt-4"
        rows={4}
        placeholder="รายละเอียดหลักสูตร"
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
      />

      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            onChange({ ...form, published: e.target.checked })
          }
        />
        เผยแพร่หลักสูตร
      </label>

      <div className="flex gap-3 mt-5">
        <button
          disabled={loading || uploading}
          className="bg-green-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
        >
          {loading
            ? "กำลังบันทึก..."
            : editing
            ? "บันทึกการแก้ไข"
            : "บันทึกหลักสูตร"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-6 py-3 rounded-xl"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
