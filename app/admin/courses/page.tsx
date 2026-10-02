import CourseManagementPage from "@/components/courses/CourseManagementPage";

export default function AdminCoursesPage() {
  return (
    <CourseManagementPage
      scope="admin"
      title="จัดการหลักสูตรทั้งหมด"
      description="Admin สามารถตรวจสอบ แก้ไข และลบหลักสูตรได้"
    />
  );
}
