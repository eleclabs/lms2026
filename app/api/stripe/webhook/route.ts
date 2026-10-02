import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyStripeWebhook } from "@/lib/stripe";
import Order from "@/models/Order";
import { fulfillOrder } from "@/services/server/orderService";

type StripeEvent = {
  type: string;
  data: {
    object: {
      id: string;
      payment_intent?: string | null;
      payment_status?: string;
      metadata?: { orderId?: string };
    };
  };
};

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  try {
    if (!verifyStripeWebhook(payload, signature)) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(payload) as StripeEvent;
    await connectDB();

    if (
      event.type === "checkout.session.completed" &&
      event.data.object.payment_status === "paid"
    ) {
      const orderId = event.data.object.metadata?.orderId;
      if (orderId) {
        await Order.updateOne(
          { _id: orderId },
          { stripeSessionId: event.data.object.id }
        );
        await fulfillOrder(orderId, event.data.object.payment_intent);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook failed", error);
    return NextResponse.json({ message: "Webhook failed" }, { status: 400 });
  }
}
