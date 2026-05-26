/* import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,
    category: String,
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    thumbnail: String,

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Course || mongoose.model("Course", CourseSchema);


import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    thumbnail: String,

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Course || mongoose.model("Course", CourseSchema);

 */

import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },

    // เพิ่มตรงนี้
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverImage: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Course || mongoose.model("Course", CourseSchema);