import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { deleteReplacedImage, isImageInFolder } from "@/lib/cloudinary";

const publicFields = "name email image imagePublicId provider role";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select(publicFields);

  if (!user) {
    return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const imagePublicId =
    typeof body.imagePublicId === "string" ? body.imagePublicId.trim() : "";

  if (!name) {
    return NextResponse.json({ message: "กรุณากรอกชื่อ" }, { status: 400 });
  }

  if (name.length > 100 || image.length > 2048 || imagePublicId.length > 255) {
    return NextResponse.json({ message: "ข้อมูลโปรไฟล์ยาวเกินกำหนด" }, { status: 400 });
  }

  if (!isImageInFolder(imagePublicId, `lms2026/profiles/${session.user.id}`)) {
    return NextResponse.json({ message: "รูปโปรไฟล์ไม่ถูกต้อง" }, { status: 400 });
  }

  await connectDB();
  const previousUser = await User.findById(session.user.id).select("imagePublicId");

  if (!previousUser) {
    return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
  }

  const user = await User.findByIdAndUpdate(
    session.user.id,
    { name, image, imagePublicId },
    { new: true, runValidators: true }
  ).select(publicFields);

  try {
    await deleteReplacedImage(previousUser.imagePublicId, imagePublicId);
  } catch (error) {
    console.error("Could not delete replaced profile image", error);
  }

  return NextResponse.json(user);
}
