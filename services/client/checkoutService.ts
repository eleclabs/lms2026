import { apiDelete, apiGet, apiPost } from "@/services/core/httpService";
import { Coupon } from "@/types/coupon";
import { Order } from "@/types/order";

export function createCheckout(courseIds: string[], couponCode?: string) {
  return apiPost<{ url: string; free?: boolean }>("/api/checkout/session", {
    courseIds,
    couponCode,
  });
}

export function getOrders() {
  return apiGet<Order[]>("/api/orders");
}

export function getOrder(params: { sessionId?: string; orderId?: string }) {
  const query = new URLSearchParams();
  if (params.sessionId) query.set("sessionId", params.sessionId);
  if (params.orderId) query.set("orderId", params.orderId);
  return apiGet<Order>(`/api/orders?${query}`);
}

export function requestRefund(orderId: string) {
  return apiPost<{ message: string }>(`/api/orders/${orderId}/refund`, {});
}

export function getCoupons() {
  return apiGet<Coupon[]>("/api/admin/coupons");
}

export function createCoupon(payload: Omit<Coupon, "_id" | "usedCount" | "active">) {
  return apiPost<Coupon>("/api/admin/coupons", payload);
}

export function deleteCoupon(couponId: string) {
  return apiDelete<{ message: string }>(`/api/admin/coupons/${couponId}`);
}
