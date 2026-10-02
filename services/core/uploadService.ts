async function uploadAsset(
  file: File,
  endpoint: string
) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "อัปโหลดไฟล์ไม่สำเร็จ"
    );
  }

  return data as { url: string; publicId: string };
}

export async function uploadFile(file: File, endpoint: string) {
  const uploaded = await uploadAsset(file, endpoint);
  return uploaded.url;
}

export function uploadCoverImage(file: File) {
  return uploadAsset(
    file,
    "/api/upload/cover"
  );
}

export function uploadProfileImage(file: File) {
  return uploadAsset(file, "/api/upload/profile");
}

export function uploadLessonFile(file: File) {
  return uploadFile(
    file,
    "/api/upload"
  );
}

