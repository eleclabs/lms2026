import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export function listCoupons() {
  return connectDB().then(() => Coupon.find().sort({ createdAt: -1 }).lean());
}

export async function createCoupon(payload: {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiresAt?: Date;
}) {
  await connectDB();
  return Coupon.create({ ...payload, active: true });
}

export async function removeCoupon(couponId: string) {
  await connectDB();
  return Coupon.findByIdAndDelete(couponId);
}
