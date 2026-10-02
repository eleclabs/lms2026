export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">LMS Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-xl p-4">
          <p className="text-gray-500">หลักสูตร</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">ผู้เรียน</p>
          <h2 className="text-3xl font-bold">150</h2>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">ครูผู้สอน</p>
          <h2 className="text-3xl font-bold">8</h2>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">บทเรียน</p>
          <h2 className="text-3xl font-bold">40</h2>
        </div>
      </div>
    </main>
  );
}