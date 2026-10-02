"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/services/client/userService";
import { uploadProfileImage } from "@/services/core/uploadService";
import { User } from "@/types/user";

const roleLabels = {
  admin: "ผู้ดูแลระบบ",
  teacher: "ผู้สอน",
  student: "ผู้เรียน",
};

export default function ProfilePage() {
  const router = useRouter();
  const { status, update: updateSession } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") return;

    getMe()
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setImage(data.image || "");
        setImagePublicId(data.imagePublicId || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [router, status]);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");
      const uploaded = await uploadProfileImage(file);
      setImage(uploaded.url);
      setImagePublicId(uploaded.publicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");
      const updated = await updateMe({ name, image, imagePublicId });
      setUser(updated);
      setName(updated.name);
      setImage(updated.image || "");
      setImagePublicId(updated.imagePublicId || "");
      await updateSession();
      setMessage("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return <main className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</main>;
  }

  if (!user) {
    return <main className="min-h-screen bg-slate-50 p-8 text-center text-red-600">{error || "ไม่พบข้อมูลผู้ใช้"}</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-sm font-semibold text-blue-600">บัญชีของฉัน</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">ข้อมูลโปรไฟล์</h1>
          <p className="mt-2 text-slate-500">ดูและแก้ไขชื่อกับรูปประจำตัวของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {image ? (
                <div
                  role="img"
                  aria-label={name || "รูปโปรไฟล์"}
                  className="h-28 w-28 rounded-full border-4 border-white bg-cover bg-center shadow"
                  style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-4xl font-bold text-blue-700 shadow">
                  {(name || user.email).charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-center text-white sm:text-left">
                <h2 className="text-2xl font-bold">{name || user.name}</h2>
                <p className="mt-1 text-blue-100">{user.email}</p>
                <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                  {uploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={uploading} onChange={handleImageChange} />
                </label>
                <p className="mt-2 text-xs text-blue-100">JPG, PNG หรือ WEBP ขนาดไม่เกิน 5 MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-7">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">ชื่อที่แสดง</label>
              <input id="name" value={name} maxLength={100} required onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">อีเมล</label>
                <input value={user.email} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">ประเภทผู้ใช้</label>
                <input value={roleLabels[user.role]} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
              </div>
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button type="submit" disabled={saving || uploading} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
