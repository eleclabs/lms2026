import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { id } = await context.params;

  const enrollment = await Enrollment.findOne({
    student: session.user.id,
    course: id,
  });

  if (!enrollment) {
    return NextResponse.json(
      { message: "กรุณาลงทะเบียนก่อนเข้าเรียน" },
      { status: 403 }
    );
  }

  const lessons = await Lesson.find({
    course: id,
  }).sort({ order: 1 });

  return NextResponse.json(lessons);
}

