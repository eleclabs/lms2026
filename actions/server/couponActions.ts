import { isValidObjectId } from "mongoose";
import { ApiError, assertApi } from "@/lib/api/errors";
import { requireUser } from "@/services/server/authService";
import {
  createCoupon,
  listCoupons,
  removeCoupon,
} from "@/services/server/couponService";

export async function getCouponsAction() {
  await requireUser(["admin"]);
  return listCoupons();
}

export async function createCouponAction(body: Record<string, unknown>) {
  await requireUser(["admin"]);
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const discountType = body.discountType;
  const value = Number(body.value);

  assertApi(/^[A-Z0-9_-]{3,30}$/.test(code), 400, "รหัสคูปองไม่ถูกต้อง");
  assertApi(
    discountType === "percent" || discountType === "fixed",
    400,
    "ประเภทส่วนลดไม่ถูกต้อง"
  );
  assertApi(
    Number.isFinite(value) && value > 0 &&
      (discountType !== "percent" || value <= 100),
    400,
    "มูลค่าส่วนลดไม่ถูกต้อง"
  );

  try {
    return await createCoupon({
      code,
      discountType,
      value,
      minPurchase: Math.max(0, Number(body.minPurchase) || 0),
      maxDiscount: body.maxDiscount
        ? Math.max(0, Number(body.maxDiscount))
        : undefined,
      usageLimit: body.usageLimit
        ? Math.max(1, Number(body.usageLimit))
        : undefined,
      expiresAt: body.expiresAt
        ? new Date(`${body.expiresAt}T23:59:59.999Z`)
        : undefined,
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      throw new ApiError(409, "รหัสคูปองนี้มีอยู่แล้ว");
    }
    throw error;
  }
}

export async function deleteCouponAction(couponId: string) {
  await requireUser(["admin"]);
  assertApi(isValidObjectId(couponId), 404, "ไม่พบคูปอง");
  const coupon = await removeCoupon(couponId);
  assertApi(coupon, 404, "ไม่พบคูปอง");
  return { message: "ลบคูปองเรียบร้อยแล้ว" };
}
