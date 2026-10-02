type Props = {
  message: string;
  onRetry: () => void;
};

export default function CourseLoadError({ message, onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <p className="font-semibold">โหลดข้อมูลหลักสูตรไม่สำเร็จ</p>
      <p className="mt-1 text-sm text-amber-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white transition hover:bg-amber-700"
      >
        ลองใหม่
      </button>
    </div>
  );
}
