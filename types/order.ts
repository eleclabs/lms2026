export type Order = {
  _id: string;
  items: Array<{ course: string; title: string; price: number }>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  currency: string;
  stripeSessionId?: string;
  status: "pending" | "processing" | "paid" | "refunded" | "failed";
  paidAt?: string;
  refundEligibleUntil?: string;
  refundedAt?: string;
  createdAt: string;
};
