
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { createCredentialsUser } from "@/services/server/userService";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    await createCredentialsUser(body);

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "สมัครสมาชิกไม่สำเร็จ",
      },
      { status: 400 }
    );
  }
}

