import { isValidObjectId } from "mongoose";
import { ApiError, assertApi } from "@/lib/api/errors";
import { connectDB } from "@/lib/mongodb";
import { stripeRequest } from "@/lib/stripe";
import Coupon from "@/models/Coupon";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Order from "@/models/Order";
import { requireUser } from "@/services/server/authService";
import { fulfillOrder } from "@/services/server/orderService";

type StripeCheckoutSession = { id: string; url: string | null };

function calculateDiscount(
  subtotal: number,
  coupon: {
    discountType: "percent" | "fixed";
    value: number;
    maxDiscount?: number;
  }
) {
  const raw =
    coupon.discountType === "percent"
      ? (subtotal * coupon.value) / 100
      : coupon.value;
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return Math.min(subtotal, Math.max(0, Number(capped.toFixed(2))));
}

export async function createCheckoutAction(
  req: Request,
  body: Record<string, unknown>
) {
  const user = await requireUser(["student"]);
  const courseIds = Array.isArray(body.courseIds)
    ? [...new Set(body.courseIds.filter((id): id is string => typeof id === "string"))]
    : [];
  assertApi(
    courseIds.length > 0 &&
      courseIds.length <= 20 &&
      courseIds.every(isValidObjectId),
    400,
    "รายการหลักสูตรไม่ถูกต้อง"
  );

  await connectDB();
  const [courses, enrollments] = await Promise.all([
    Course.find({ _id: { $in: courseIds }, published: true })
      .select("title price")
      .lean(),
    Enrollment.find({ student: user.id, course: { $in: courseIds } })
      .select("course")
      .lean(),
  ]);
  const enrolledIds = new Set(enrollments.map((item) => String(item.course)));
  const items = courses.filter((course) => !enrolledIds.has(String(course._id)));
  assertApi(items.length > 0, 409, "คุณสมัครหลักสูตรในรถเข็นแล้ว");

  const subtotal = items.reduce((sum, course) => sum + (course.price || 0), 0);
  const couponCode =
    typeof body.couponCode === "string"
      ? body.couponCode.trim().toUpperCase()
      : "";
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, active: true }).lean();
    assertApi(
      coupon &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit),
      400,
      "คูปองไม่ถูกต้องหรือหมดอายุ"
    );
    assertApi(
      subtotal >= (coupon.minPurchase || 0),
      400,
      `คูปองนี้ใช้ได้เมื่อซื้อขั้นต่ำ ${coupon.minPurchase.toLocaleString()} บาท`
    );
    discount = calculateDiscount(subtotal, coupon);
  }

  const total = Math.max(0, Number((subtotal - discount).toFixed(2)));
  const order = await Order.create({
    user: user.id,
    items: items.map((course) => ({
      course: course._id,
      title: course.title,
      price: course.price || 0,
    })),
    subtotal,
    discount,
    total,
    couponCode: couponCode || undefined,
    currency: "thb",
  });

  if (total === 0) {
    await fulfillOrder(order._id.toString(), null);
    return { url: `/checkout/success?order_id=${order._id}`, free: true };
  }

  try {
    const origin = process.env.NEXTAUTH_URL || new URL(req.url).origin;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("payment_method_types[0]", "card");
    params.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${origin}/cart?checkout=cancelled`);
    params.set("client_reference_id", user.id);
    if (user.email) params.set("customer_email", user.email);
    params.set("metadata[orderId]", order._id.toString());
    params.set("payment_intent_data[metadata][orderId]", order._id.toString());
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "thb");
    params.set("line_items[0][price_data][unit_amount]", String(Math.round(total * 100)));
    params.set("line_items[0][price_data][product_data][name]", `${items.length} หลักสูตรจาก LMS`);
    params.set(
      "line_items[0][price_data][product_data][description]",
      items.map((course) => course.title).join(", ").slice(0, 450)
    );

    const stripeSession = await stripeRequest<StripeCheckoutSession>(
      "/checkout/sessions",
      params,
      `checkout-${order._id}`
    );
    assertApi(stripeSession.url, 502, "Stripe did not return a Checkout URL");
    order.stripeSessionId = stripeSession.id;
    await order.save();
    return { url: stripeSession.url };
  } catch (error) {
    order.status = "failed";
    await order.save();
    if (error instanceof ApiError) throw error;
    console.error("Stripe Checkout creation failed", error);
    throw new ApiError(
      502,
      error instanceof Error ? error.message : "สร้าง Checkout ไม่สำเร็จ"
    );
  }
}
