import CourseCatalogPage from "@/components/courses/CourseCatalogPage";

export default function StudentCoursesPage() {
  return (
    <CourseCatalogPage
      scope="student"
      title="หลักสูตรทั้งหมด"
      description="ค้นหาหลักสูตรใหม่ หรือเข้าสู่หลักสูตรที่ลงทะเบียนแล้ว"
    />
  );
}
