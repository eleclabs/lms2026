export async function uploadCoverImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/cover", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "อัปโหลดรูปภาพไม่สำเร็จ");
  }

  return data.url as string;
}

