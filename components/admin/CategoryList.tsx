import { Category } from "@/types/category";

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <div key={cat._id} className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold">{cat.name}</h2>
          <p className="text-sm text-gray-500 mt-2">
            {cat.description || "ไม่มีรายละเอียด"}
          </p>
        </div>
      ))}
    </div>
  );
}

