"use client";

import { useEffect, useState } from "react";
import { getOrders, requestRefund } from "@/services/client/checkoutService";
import { Order } from "@/types/order";

const statusLabels: Record<Order["status"], string> = {
  pending: "รอชำระเงิน",
  processing: "กำลังดำเนินการ",
  paid: "ชำระแล้ว",
  refunded: "คืนเงินแล้ว",
  failed: "ไม่สำเร็จ",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState("");

  async function reload() {
    setOrders(await getOrders());
  }

  useEffect(() => {
    let active = true;
    getOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleRefund(orderId: string) {
    if (!confirm("ยืนยันขอคืนเงินและยกเลิกสิทธิ์เข้าถึงหลักสูตรในคำสั่งซื้อนี้?")) return;
    try {
      setRefundingId(orderId);
      const result = await requestRefund(orderId);
      alert(result.message);
      await reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "คืนเงินไม่สำเร็จ");
    } finally {
      setRefundingId("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">คำสั่งซื้อของฉัน</h1>
        <p className="mt-2 text-slate-500">คำสั่งซื้อที่ชำระผ่าน Stripe และสิทธิ์รับประกันคืนเงิน</p>
        {loading ? (
          <p className="mt-8 text-slate-500">กำลังโหลด...</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center text-slate-500">ยังไม่มีคำสั่งซื้อ</div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => {
              const eligible =
                order.status === "paid" &&
                Boolean(order.refundEligibleUntil) &&
                new Date(order.refundEligibleUntil as string) > new Date() &&
                order.total > 0;
              return (
                <article key={order._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <h2 className="mt-2 font-bold text-slate-900">{order.items.map((item) => item.title).join(", ")}</h2>
                      <p className="mt-2 text-sm text-slate-500">{new Date(order.createdAt).toLocaleString("th-TH")}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{statusLabels[order.status]}</span>
                      <p className="mt-3 text-xl font-bold">{order.total.toLocaleString()} บาท</p>
                    </div>
                  </div>
                  {order.discount > 0 && <p className="mt-3 text-sm text-green-700">ส่วนลด {order.discount.toLocaleString()} บาท {order.couponCode && `(${order.couponCode})`}</p>}
                  {eligible && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                      <p className="text-sm text-slate-600">คืนเงินได้ถึง {new Date(order.refundEligibleUntil as string).toLocaleDateString("th-TH")}</p>
                      <button disabled={refundingId === order._id} onClick={() => void handleRefund(order._id)} className="rounded-xl border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">
                        {refundingId === order._id ? "กำลังคืนเงิน..." : "ขอคืนเงิน"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
