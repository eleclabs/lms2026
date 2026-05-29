import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  const categories = await Category.find().sort({
    createdAt: -1,
  });

  return NextResponse.json(categories);
}