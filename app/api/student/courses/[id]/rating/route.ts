import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isValidObjectId, Types } from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseRating from "@/models/CourseRating";
import Enrollment from "@/models/Enrollment";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { rating } = await req.json();
  const numericRating = Number(rating);

  if (
    !isValidObjectId(id) ||
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return NextResponse.json({ message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 5" }, { status: 400 });
  }

  await connectDB();
  const enrollment = await Enrollment.exists({
    course: id,
    student: session.user.id,
  });

  if (!enrollment) {
    return NextResponse.json(
      { message: "ต้องสมัครเรียนก่อนจึงจะให้คะแนนได้" },
      { status: 403 }
    );
  }

  await CourseRating.findOneAndUpdate(
    { course: id, student: session.user.id },
    { rating: numericRating },
    { upsert: true, new: true, runValidators: true }
  );

  const [summary] = await CourseRating.aggregate<{
    average: number;
    count: number;
  }>([
    { $match: { course: new Types.ObjectId(id) } },
    { $group: { _id: "$course", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const ratingAverage = Number((summary?.average || 0).toFixed(1));
  const ratingCount = summary?.count || 0;

  await Course.findByIdAndUpdate(id, { ratingAverage, ratingCount });

  return NextResponse.json({
    message: "บันทึกคะแนนเรียบร้อยแล้ว",
    ratingAverage,
    ratingCount,
    userRating: numericRating,
  });
}
