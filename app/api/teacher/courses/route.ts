

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session =
    await getServerSession(
      authOptions
    );

  if (
    !session ||
    session.user.role !== "teacher"
  ) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await connectDB();

  const courses =
    await Course.find({
      teacher:
        session.user.id,
    })
      .populate("category")
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

  return NextResponse.json(
    courses
  );
}

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(
      authOptions
    );

  if (
    !session ||
    session.user.role !== "teacher"
  ) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await connectDB();

  const body = await req.json();

  if (!body.title) {
    return NextResponse.json(
      {
        message:
          "กรุณากรอกชื่อรายวิชา",
      },
      {
        status: 400,
      }
    );
  }

  const course = await Course.create({
    title: body.title,
    description: body.description,
    price: Number(body.price) || 0,
    category: body.category || undefined,
    level: body.level || "beginner",
    thumbnail: body.thumbnail || "",
    published: Boolean(body.published),
    teacher: session.user.id,
  });


  return NextResponse.json(
    course,
    {
      status: 201,
    }
  );
}