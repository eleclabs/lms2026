import mongoose, { models, Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: String,
    currency: { type: String, default: "thb" },
    stripeSessionId: { type: String, unique: true, sparse: true },
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "refunded", "failed"],
      default: "pending",
    },
    paidAt: Date,
    refundEligibleUntil: Date,
    refundedAt: Date,
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);
