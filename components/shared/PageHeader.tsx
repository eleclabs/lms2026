
type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

