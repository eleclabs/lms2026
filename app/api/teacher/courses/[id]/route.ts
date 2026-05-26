/* 
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();

  const course = await Course.findOneAndUpdate(
    {
      _id: params.id,
      teacher: session.user.id,
    },
    {
      title: body.title,
      description: body.description,
      category: body.category,
      level: body.level,
      thumbnail: body.thumbnail,
      published: Boolean(body.published),
    },
    { new: true }
  );

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา หรือไม่มีสิทธิ์แก้ไข" },
      { status: 404 }
    );
  }

  return NextResponse.json(course);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const course = await Course.findOneAndDelete({
    _id: params.id,
    teacher: session.user.id,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา หรือไม่มีสิทธิ์ลบ" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "ลบรายวิชาสำเร็จ",
  });
}

 */


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();

  const course = await Course.findOneAndUpdate(
    {
      _id: id,
      teacher: session.user.id,
    },
    {
      title: body.title,
      description: body.description,
      category: body.category || null,
      level: body.level,
      thumbnail: body.thumbnail,
      published: Boolean(body.published),
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name");

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา หรือไม่มีสิทธิ์แก้ไข" },
      { status: 404 }
    );
  }

  return NextResponse.json(course);
}

export async function DELETE(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const course = await Course.findOneAndDelete({
    _id: id,
    teacher: session.user.id,
  });

  if (!course) {
    return NextResponse.json(
      { message: "ไม่พบรายวิชา หรือไม่มีสิทธิ์ลบ" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "ลบรายวิชาสำเร็จ",
  });
}