import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { courseId, title, content, videoUrl, pdfUrl, order } =
    await req.json();

  const course = await Course.findOne({
    _id: courseId,
    teacher: session.user.id,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชาหรือไม่มีสิทธิ์" },
      { status: 403 }
    );
  }

  const lesson = await Lesson.create({
    course: courseId,
    title,
    content,
    videoUrl,
    pdfUrl,
    order,
  });

  return NextResponse.json(lesson, { status: 201 });
}

