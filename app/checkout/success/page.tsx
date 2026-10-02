"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getOrder } from "@/services/client/checkoutService";
import { removeCoursesFromCart } from "@/services/client/cartService";
import { Order } from "@/types/order";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || undefined;
  const orderId = searchParams.get("order_id") || undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let attempts = 0;

    async function loadOrder() {
      if (!sessionId && !orderId) {
        setError("ไม่พบข้อมูล Checkout");
        return;
      }
      try {
        const result = await getOrder({ sessionId, orderId });
        if (!active) return;
        setOrder(result);
        if (result.status === "paid") {
          removeCoursesFromCart(result.items.map((item) => String(item.course)));
        }
      } catch (err) {
        if (active && attempts >= 8) {
          setError(err instanceof Error ? err.message : "ตรวจสอบคำสั่งซื้อไม่สำเร็จ");
        }
      }
    }

    void loadOrder();
    const timer = window.setInterval(() => {
      attempts += 1;
      if (attempts > 8 || order?.status === "paid") {
        window.clearInterval(timer);
        return;
      }
      void loadOrder();
    }, 1500);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [order?.status, orderId, sessionId]);

  const paid = order?.status === "paid";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {paid ? "✓" : "…"}
        </div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          {paid ? "ชำระเงินสำเร็จ" : "กำลังยืนยันการชำระเงิน"}
        </h1>
        <p className="mt-3 text-slate-500">
          {paid
            ? "เพิ่มหลักสูตรลงในบัญชีของคุณเรียบร้อยแล้ว"
            : "Stripe กำลังส่งผลการชำระเงิน กรุณารอสักครู่"}
        </p>
        {order && <p className="mt-4 font-semibold text-slate-800">ยอดชำระ {order.total.toLocaleString()} บาท</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/student/my-courses" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">ไปยังหลักสูตรของฉัน</Link>
          <Link href="/orders" className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700">ดูคำสั่งซื้อ</Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">กำลังตรวจสอบการชำระเงิน...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
