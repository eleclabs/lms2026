import { ApiError, assertApi } from "@/lib/api/errors";
import { ImageUploadPreset, uploadImage } from "@/lib/cloudinary";
import { requireUser } from "@/services/server/authService";
import { UserRole } from "@/types/user";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type ImageActionOptions = {
  roles?: UserRole[];
  preset: ImageUploadPreset;
  folder: (userId: string) => string;
};

async function uploadImageAction(req: Request, options: ImageActionOptions) {
  const user = await requireUser(options.roles);
  const file = (await req.formData()).get("file");

  assertApi(file instanceof File, 400, "ไม่พบไฟล์รูปภาพ");
  assertApi(
    ALLOWED_IMAGE_TYPES.includes(file.type),
    400,
    "อนุญาตเฉพาะไฟล์ JPG, PNG และ WEBP"
  );
  assertApi(file.size <= MAX_IMAGE_SIZE, 400, "รูปภาพต้องมีขนาดไม่เกิน 5 MB");

  try {
    const result = await uploadImage(
      file,
      options.folder(user.id),
      options.preset
    );
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    throw new ApiError(502, "อัปโหลดรูปไป Cloudinary ไม่สำเร็จ");
  }
}

export function uploadCourseCoverAction(req: Request) {
  return uploadImageAction(req, {
    roles: ["admin", "teacher"],
    preset: "course-cover",
    folder: (userId) => `lms2026/course-covers/${userId}`,
  });
}

export function uploadProfileImageAction(req: Request) {
  return uploadImageAction(req, {
    preset: "profile",
    folder: (userId) => `lms2026/profiles/${userId}`,
  });
}
