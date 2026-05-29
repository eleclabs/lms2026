import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const enrollments = await Enrollment.find({
    student: session.user.id,
  })
    .populate({
      path: "course",
      populate: [
        { path: "category" },
        { path: "teacher", select: "name email" },
      ],
    })
    .sort({ createdAt: -1 });

  return NextResponse.json(enrollments);
}

