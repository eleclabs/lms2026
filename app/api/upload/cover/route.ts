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

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "อนุญาตเฉพาะ JPG, PNG, WEBP" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "covers"
  );

  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replaceAll(" ", "-");
  const filename = `${Date.now()}-${safeName}`;

  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    url: `/uploads/covers/${filename}`,
  });
}

