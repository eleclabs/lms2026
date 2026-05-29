import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import Category from "@/models/Category";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const courses = await Course.find()
    .populate("category")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(courses);
}

