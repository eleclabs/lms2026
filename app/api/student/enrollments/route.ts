import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { courseId } = await req.json();

  const course = await Course.findOne({
    _id: courseId,
    published: true,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา" },
      { status: 404 }
    );
  }

  const exists = await Enrollment.findOne({
    student: session.user.id,
    course: courseId,
  });

  if (exists) {
    return NextResponse.json(
      { message: "ลงทะเบียนรายวิชานี้แล้ว" },
      { status: 409 }
    );
  }

  await Enrollment.create({
    student: session.user.id,
    course: courseId,
    progress: 0,
  });

  return NextResponse.json({
    message: "ลงทะเบียนเรียนสำเร็จ",
  });
}

