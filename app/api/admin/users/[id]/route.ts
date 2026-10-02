import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CourseRating from "@/models/CourseRating";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (id === session.user.id) {
    return NextResponse.json(
      { message: "ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่" },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
  }

  await CourseRating.deleteMany({ student: id });

  try {
    await deleteImage(user.imagePublicId);
  } catch (error) {
    console.error("Could not delete user profile image", error);
  }

  return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" });
}
