/* 
import mongoose, { Schema, models } from "mongoose";

const LessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    content: String,
    videoUrl: String,
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default models.Lesson || mongoose.model("Lesson", LessonSchema);


import mongoose, { Schema, models } from "mongoose";

const LessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },

    title: String,
    content: String,
    videoUrl: String,
    pdfUrl: String,
  },
  { timestamps: true }
);

export default models.Lesson ||  mongoose.model("Lesson", LessonSchema);
*/

import mongoose, { Schema, models } from "mongoose";

const LessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: String,
    videoUrl: String,
    pdfUrl: String,
    order: {
      type: Number,
      default: 1,
    },
    durationMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Lesson || mongoose.model("Lesson", LessonSchema);
