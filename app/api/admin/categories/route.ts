import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const categories = await Category.find().sort({ createdAt: -1 });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json(
      { message: "กรุณากรอกชื่อหมวดหมู่" },
      { status: 400 }
    );
  }

  const exists = await Category.findOne({ name });

  if (exists) {
    return NextResponse.json(
      { message: "มีหมวดหมู่นี้แล้ว" },
      { status: 409 }
    );
  }

  const category = await Category.create({
    name,
    description,
  });

  return NextResponse.json(category, { status: 201 });
}

