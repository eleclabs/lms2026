
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { resetUserPassword } from "@/services/server/userService";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบ" },
        { status: 400 }
      );
    }

    await resetUserPassword(token, password);

    return NextResponse.json({
      message: "เปลี่ยนรหัสผ่านสำเร็จ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "เปลี่ยนรหัสผ่านไม่สำเร็จ",
      },
      { status: 400 }
    );
  }
}

