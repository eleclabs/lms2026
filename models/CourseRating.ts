import mongoose, { models, Schema } from "mongoose";

const CourseRatingSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

CourseRatingSchema.index({ course: 1, student: 1 }, { unique: true });

export default models.CourseRating ||
  mongoose.model("CourseRating", CourseRatingSchema);
