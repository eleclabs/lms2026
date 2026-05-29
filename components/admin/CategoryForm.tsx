import { CategoryForm as CategoryFormType } from "@/types/category";

type Props = {
  form: CategoryFormType;
  loading?: boolean;
  onChange: (form: CategoryFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CategoryForm({
  form,
  loading,
  onChange,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow p-6 mb-6"
    >
      <input
        className="w-full border rounded-xl px-4 py-3 mb-3"
        placeholder="ชื่อหมวดหมู่"
        value={form.name}
        onChange={(e) =>
          onChange({ ...form, name: e.target.value })
        }
      />

      <textarea
        className="w-full border rounded-xl px-4 py-3 mb-3"
        placeholder="รายละเอียด"
        value={form.description}
        onChange={(e) =>
          onChange({ ...form, description: e.target.value })
        }
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-3 rounded-xl"
      >
        {loading ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
      </button>
    </form>
  );
}

