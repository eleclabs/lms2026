
type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, description, children }: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>

        {description && (
          <p className="text-center text-gray-500 mb-6">{description}</p>
        )}

        {children}
      </div>
    </main>
  );
}

