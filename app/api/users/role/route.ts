import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: Request) {
  await connectDB();

  const { userId, role } = await req.json();

  if (!["admin", "teacher", "student"].includes(role)) {
    return NextResponse.json(
      { message: "Role ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  return NextResponse.json(user);
}