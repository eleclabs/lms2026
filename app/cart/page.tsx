"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { getCartItems, removeCourseFromCart } from "@/services/client/cartService";
import { createCheckout } from "@/services/client/checkoutService";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setItems(getCartItems()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  function handleRemove(courseId: string) {
    setItems(removeCourseFromCart(courseId));
  }

  async function handleCheckout() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/cart")}`);
      return;
    }
    if (session.user.role !== "student") {
      setError("Checkout ใช้ได้เฉพาะบัญชีผู้เรียนเท่านั้น");
      return;
    }

    try {
      setCheckingOut(true);
      setError("");
      const result = await createCheckout(
        items.map((item) => item.courseId),
        couponCode.trim() || undefined
      );
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เริ่ม Checkout ไม่สำเร็จ");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">รถเข็นของฉัน</h1>
        <p className="mt-2 text-slate-500">{items.length} หลักสูตรในรถเข็น</p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">ยังไม่มีหลักสูตรในรถเข็น</p>
            <Link href="/courses" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">เลือกดูหลักสูตร</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.courseId} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Link href={`/courses/${item.courseId}`} className="h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                    {item.thumbnail && <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(item.thumbnail)})` }} />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/courses/${item.courseId}`} className="font-bold text-slate-900 hover:text-blue-600">{item.title}</Link>
                    <p className="mt-1 text-sm text-slate-500">{item.teacher || "ทีมผู้สอน"}</p>
                    <p className="mt-3 font-bold text-slate-900">{item.price ? `${item.price.toLocaleString()} บาท` : "ฟรี"}</p>
                    <button onClick={() => handleRemove(item.courseId)} className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700">นำออก</button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">ยอดรวมก่อนส่วนลด</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{total ? `${total.toLocaleString()} บาท` : "ฟรี"}</p>
              <label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="coupon">คูปองส่วนลด</label>
              <input id="coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="กรอกรหัสคูปอง" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-violet-600" />
              {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button onClick={() => void handleCheckout()} disabled={checkingOut || status === "loading"} className="mt-5 w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white hover:bg-violet-800 disabled:bg-slate-400">
                {checkingOut ? "กำลังไปยัง Stripe..." : "ชำระเงินด้วยบัตร"}
              </button>
              <div className="mt-5 rounded-xl bg-green-50 p-4 text-center text-sm text-green-800">
                <p className="font-bold">รับประกันคืนเงินภายใน 30 วัน</p>
                <p className="mt-1 text-xs">ชำระเงินอย่างปลอดภัยผ่าน Stripe</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
