import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export type ImageUploadPreset = "profile" | "course-cover";

const imageTransformations = {
  profile: {
    width: 512,
    height: 512,
    crop: "fill",
    gravity: "auto",
    quality: 70,
    flags: "strip_profile",
  },
  "course-cover": {
    width: 1280,
    height: 720,
    crop: "limit",
    quality: 70,
    flags: "strip_profile",
  },
} as const;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function assertCloudinaryConfig() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary configuration is incomplete");
  }
}

export async function uploadImage(
  file: File,
  folder: string,
  preset: ImageUploadPreset
) {
  assertCloudinaryConfig();
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp",
        transformation: imageTransformations[preset],
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function deleteImage(publicId?: string | null) {
  if (!publicId) return;

  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

export async function deleteReplacedImage(
  previousPublicId?: string | null,
  nextPublicId?: string | null
) {
  if (previousPublicId && previousPublicId !== nextPublicId) {
    await deleteImage(previousPublicId);
  }
}

export function isImageInFolder(publicId: string, folder: string) {
  return !publicId || publicId.startsWith(`${folder}/`);
}
