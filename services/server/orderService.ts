import Coupon from "@/models/Coupon";
import Enrollment from "@/models/Enrollment";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function fulfillOrder(
  orderId: string,
  paymentIntentId?: string | null
) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "pending" },
    { status: "processing", stripePaymentIntentId: paymentIntentId || undefined },
    { new: true }
  );

  if (!order) return Order.findById(orderId);

  try {
    await Promise.all(
      order.items.map((item: { course: unknown }) =>
        Enrollment.updateOne(
          { student: order.user, course: item.course },
          { $setOnInsert: { progress: 0 } },
          { upsert: true }
        )
      )
    );

    const paidAt = new Date();
    order.status = "paid";
    order.paidAt = paidAt;
    order.refundEligibleUntil = new Date(paidAt.getTime() + THIRTY_DAYS_MS);
    await order.save();

    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    return order;
  } catch (error) {
    await Order.updateOne({ _id: orderId }, { status: "pending" });
    throw error;
  }
}

export async function listOrdersForUser(userId: string) {
  await connectDB();
  return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
}

export async function findOrderForUser(
  userId: string,
  query: { sessionId?: string; orderId?: string }
) {
  await connectDB();
  return Order.findOne({
    user: userId,
    ...(query.sessionId
      ? { stripeSessionId: query.sessionId }
      : { _id: query.orderId }),
  }).lean();
}

export async function findRefundableOrder(userId: string, orderId: string) {
  await connectDB();
  return Order.findOne({ _id: orderId, user: userId });
}

export async function completeOrderRefund(order: {
  _id: unknown;
  user: unknown;
  items: Array<{ course: unknown }>;
  save: () => Promise<unknown>;
  status: string;
  refundedAt?: Date;
}) {
  await Enrollment.deleteMany({
    student: order.user,
    course: { $in: order.items.map((item) => item.course) },
  });
  order.status = "refunded";
  order.refundedAt = new Date();
  await order.save();
}
