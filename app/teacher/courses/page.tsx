import CourseManagementPage from "@/components/courses/CourseManagementPage";

export default function TeacherCoursesPage() {
  return (
    <CourseManagementPage
      scope="teacher"
      title="จัดการหลักสูตรของครู"
      description="เพิ่ม แก้ไข ลบ และจัดการบทเรียน"
      allowCreate
    />
  );
}
