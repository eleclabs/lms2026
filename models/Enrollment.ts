import mongoose, { Schema, models } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

