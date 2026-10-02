export type Coupon = {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
};
