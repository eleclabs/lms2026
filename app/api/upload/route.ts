import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { message: "ไม่พบไฟล์" },
      { status: 400 }
    );
  }

  const allowedTypes = [
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "อนุญาตเฉพาะ PDF, MP4, WEBM, MOV" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replaceAll(" ", "-");
  const filename = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    type: file.type,
  });
}

