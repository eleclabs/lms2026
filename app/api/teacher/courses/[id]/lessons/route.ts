import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { id } = await context.params;

  const course = await Course.findOne({
    _id: id,
    teacher: session.user.id,
  })
    .populate("category")
    .populate("teacher", "name email");

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบหลักสูตรหรือไม่มีสิทธิ์" },
      { status: 404 }
    );
  }

  const lessons = await Lesson.find({
    course: id,
  }).sort({ order: 1 });

  return NextResponse.json({
    course,
    lessons,
  });
}

