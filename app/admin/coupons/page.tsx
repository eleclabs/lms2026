"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
} from "@/services/client/checkoutService";
import { Coupon } from "@/types/coupon";

type CouponFormState = {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount: number;
  usageLimit: number;
  expiresAt: string;
};

const initialForm: CouponFormState = {
  code: "",
  discountType: "percent",
  value: 10,
  minPurchase: 0,
  maxDiscount: 0,
  usageLimit: 100,
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function reload() {
    setCoupons(await getCoupons());
  }

  useEffect(() => {
    let active = true;
    getCoupons().then((data) => {
      if (active) setCoupons(data);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      await createCoupon({
        ...form,
        code: form.code.toUpperCase(),
        maxDiscount: form.maxDiscount || undefined,
        usageLimit: form.usageLimit || undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setForm(initialForm);
      await reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "สร้างคูปองไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(couponId: string) {
    if (!confirm("ยืนยันลบคูปองนี้?")) return;
    await deleteCoupon(couponId);
    await reload();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">จัดการคูปองส่วนลด</h1>
        <p className="mt-2 text-slate-500">สร้างคูปองสำหรับใช้ใน Stripe Checkout</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
          <input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="รหัสคูปอง" className="rounded-xl border px-4 py-3 uppercase" />
          <select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value as "percent" | "fixed" })} className="rounded-xl border px-4 py-3">
            <option value="percent">เปอร์เซ็นต์</option>
            <option value="fixed">จำนวนเงิน (บาท)</option>
          </select>
          <input required type="number" min={1} max={form.discountType === "percent" ? 100 : undefined} value={form.value} onChange={(event) => setForm({ ...form, value: Number(event.target.value) })} placeholder="มูลค่าส่วนลด" className="rounded-xl border px-4 py-3" />
          <input type="number" min={0} value={form.minPurchase} onChange={(event) => setForm({ ...form, minPurchase: Number(event.target.value) })} placeholder="ยอดซื้อขั้นต่ำ" className="rounded-xl border px-4 py-3" />
          <input type="number" min={0} value={form.maxDiscount} onChange={(event) => setForm({ ...form, maxDiscount: Number(event.target.value) })} placeholder="ลดสูงสุด (ถ้ามี)" className="rounded-xl border px-4 py-3" />
          <input type="number" min={1} value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: Number(event.target.value) })} placeholder="จำนวนครั้งที่ใช้ได้" className="rounded-xl border px-4 py-3" />
          <input type="date" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} className="rounded-xl border px-4 py-3" />
          <button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:bg-slate-400">{saving ? "กำลังสร้าง..." : "สร้างคูปอง"}</button>
        </form>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-4">รหัส</th><th className="p-4">ส่วนลด</th><th className="p-4">ใช้งาน</th><th className="p-4">หมดอายุ</th><th className="p-4" /></tr></thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t">
                  <td className="p-4 font-bold">{coupon.code}</td>
                  <td className="p-4">{coupon.discountType === "percent" ? `${coupon.value}%` : `${coupon.value.toLocaleString()} บาท`}</td>
                  <td className="p-4">{coupon.usedCount}/{coupon.usageLimit || "ไม่จำกัด"}</td>
                  <td className="p-4">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("th-TH") : "ไม่กำหนด"}</td>
                  <td className="p-4 text-right"><button onClick={() => void handleDelete(coupon._id)} className="font-semibold text-red-600">ลบ</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
