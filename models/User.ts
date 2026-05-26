import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    image: String,

    password: String,

    provider: {
      type: String,
      default: "credentials",
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);