import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  await connectDB();

  const { id } = await context.params;

  const course = await Course.findOne({
    _id: id,
    published: true,
  })
    .populate("category")
    .populate("teacher", "name email");

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา" },
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