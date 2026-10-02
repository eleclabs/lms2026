import { isValidObjectId } from "mongoose";
import { ApiError, assertApi } from "@/lib/api/errors";
import { stripeRequest } from "@/lib/stripe";
import { requireUser } from "@/services/server/authService";
import {
  completeOrderRefund,
  findOrderForUser,
  findRefundableOrder,
  listOrdersForUser,
} from "@/services/server/orderService";

export async function getOrdersAction(query: {
  sessionId?: string;
  orderId?: string;
}) {
  const user = await requireUser();
  if (!query.sessionId && !query.orderId) return listOrdersForUser(user.id);

  if (query.orderId) {
    assertApi(isValidObjectId(query.orderId), 404, "ไม่พบคำสั่งซื้อ");
  }
  const order = await findOrderForUser(user.id, query);
  assertApi(order, 404, "ไม่พบคำสั่งซื้อ");
  return order;
}

export async function refundOrderAction(orderId: string) {
  const user = await requireUser();
  assertApi(isValidObjectId(orderId), 404, "ไม่พบคำสั่งซื้อ");
  const order = await findRefundableOrder(user.id, orderId);

  assertApi(order?.status === "paid", 400, "คำสั่งซื้อนี้ไม่สามารถคืนเงินได้");
  assertApi(
    order.refundEligibleUntil && order.refundEligibleUntil >= new Date(),
    400,
    "หมดระยะเวลารับประกันคืนเงิน 30 วันแล้ว"
  );
  assertApi(
    order.stripePaymentIntentId && order.total > 0,
    400,
    "คำสั่งซื้อนี้ไม่มีรายการชำระผ่านบัตร"
  );

  try {
    const params = new URLSearchParams({
      payment_intent: order.stripePaymentIntentId,
      reason: "requested_by_customer",
      "metadata[orderId]": order._id.toString(),
    });
    await stripeRequest("/refunds", params, `refund-${order._id}`);
    await completeOrderRefund(order);
    return { message: "ส่งคำขอคืนเงินเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("Stripe refund failed", error);
    throw new ApiError(
      502,
      error instanceof Error ? error.message : "คืนเงินไม่สำเร็จ"
    );
  }
}
