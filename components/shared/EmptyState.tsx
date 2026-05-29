type Props = {
  message: string;
};

export default function EmptyState({ message }: Props) {
  return (
    <div className="text-center text-gray-500 mt-10">
      {message}
    </div>
  );
}
