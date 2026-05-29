import { resend } from "@/lib/resend";

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "รีเซ็ตรหัสผ่าน LMS",
    html: `
      <h2>รีเซ็ตรหัสผ่าน LMS</h2>
      <p>กรุณากดลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่</p>
      <p>
        <a href="${resetUrl}">ตั้งรหัสผ่านใหม่</a>
      </p>
      <p>ลิงก์นี้หมดอายุภายใน 30 นาที</p>
    `,
  });

  if (error) {
    throw new Error("ส่งอีเมลไม่สำเร็จ");
  }
}