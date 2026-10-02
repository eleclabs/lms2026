import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { id } = await context.params;

  const lesson = await Lesson.findById(id);

  if (!lesson) {
    return NextResponse.json(
      { message: "ไม่พบบทเรียน" },
      { status: 404 }
    );
  }

  const course = await Course.findOne({
    _id: lesson.course,
    teacher: session.user.id,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่มีสิทธิ์ลบบทเรียนนี้" },
      { status: 403 }
    );
  }

  await Lesson.findByIdAndDelete(id);

  return NextResponse.json({
    message: "ลบบทเรียนสำเร็จ",
  });
}

