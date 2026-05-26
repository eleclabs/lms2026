import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: Request) {
  await connectDB();

  const { userId, role } = await req.json();

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  return NextResponse.json(user);
}