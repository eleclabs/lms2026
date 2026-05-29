
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

export async function PATCH(
  req: Request,
  context: RouteContext
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

  const { id } =
    await context.params;

  const body =
    await req.json();

  const course =
    await Course.findOneAndUpdate(
      {
        _id: id,

        teacher:
          session.user.id,
      },
      {
        title: body.title,

        description:
          body.description,

        price:
          Number(
            body.price
          ) || 0,

        category:
          body.category ||
          undefined,

        level:
          body.level,

        thumbnail:
          body.thumbnail ||
          "",

        published: Boolean(
          body.published
        ),
      },
      {
        new: true,
      }
    );

  if (!course) {
    return NextResponse.json(
      {
        message:
          "ไม่พบรายวิชา หรือไม่มีสิทธิ์แก้ไข",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    course
  );
}

export async function DELETE(
  req: Request,
  context: RouteContext
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

  const { id } =
    await context.params;

  const course =
    await Course.findOneAndDelete(
      {
        _id: id,

        teacher:
          session.user.id,
      }
    );

  if (!course) {
    return NextResponse.json(
      {
        message:
          "ไม่พบรายวิชา หรือไม่มีสิทธิ์ลบ",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    message:
      "ลบรายวิชาสำเร็จ",
  });
}
