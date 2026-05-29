export async function uploadFile(
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

  return data.url as string;
}

export function uploadCoverImage(file: File) {
  return uploadFile(
    file,
    "/api/upload/cover"
  );
}

export function uploadLessonFile(file: File) {
  return uploadFile(
    file,
    "/api/upload"
  );
}

