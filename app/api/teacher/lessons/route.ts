
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const body = await req.json();

  const course = await Course.findOne({
    _id: body.courseId,
    teacher: session.user.id,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบหลักสูตรหรือไม่มีสิทธิ์" },
      { status: 403 }
    );
  }

  if (!body.title) {
    return NextResponse.json(
      { message: "กรุณากรอกชื่อบทเรียน" },
      { status: 400 }
    );
  }

  const lesson = await Lesson.create({
    course: body.courseId,
    title: body.title,
    content: body.content,
    videoUrl: body.videoUrl,
    pdfUrl: body.pdfUrl,
    order: Number(body.order) || 1,
    durationMinutes: Math.max(0, Number(body.durationMinutes) || 0),
  });

  return NextResponse.json(lesson, { status: 201 });
}
