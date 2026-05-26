async function getCourses() {
  const res = await fetch("http://localhost:3000/api/courses", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("โหลดข้อมูลรายวิชาไม่สำเร็จ");
  }

  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">รายวิชาในระบบ LMS</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((course: any) => (
          <div
            key={course._id}
            className="border rounded-xl p-4 shadow-sm"
          >
            <h2 className="font-semibold text-lg">{course.title}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {course.description}
            </p>
            <p className="mt-3 text-xs">
              สถานะ: {course.status}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
