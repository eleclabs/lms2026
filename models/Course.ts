
import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    level: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced",
      ],
      default: "beginner",
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    thumbnail: {
      type: String,
    },

    thumbnailPublicId: {
      type: String,
    },

    ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    ratingCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Course ||
  mongoose.model("Course", CourseSchema);
