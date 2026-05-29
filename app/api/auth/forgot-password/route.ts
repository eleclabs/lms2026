import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { saveResetToken } from "@/services/server/userService";
import { sendResetPasswordEmail } from "@/services/core/emailService";

export async function POST(req: Request) {
  const safeMessage =
    "ถ้ามีอีเมลนี้ในระบบ ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านให้";

  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "กรุณากรอก Email" },
        { status: 400 }
      );
    }

    const result = await saveResetToken(email);

    if (result) {
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${result.rawToken}`;

      await sendResetPasswordEmail(result.user.email, resetUrl);
    }

    return NextResponse.json({ message: safeMessage });
  } catch {
    return NextResponse.json(
      { message: "ส่งอีเมลไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

