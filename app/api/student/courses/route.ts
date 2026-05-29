import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  await connectDB();

  const courses = await Course.find({ published: true })
    .populate("category")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(courses);
}

