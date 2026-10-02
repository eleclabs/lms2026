import { connectDB } from "@/lib/mongodb";
import { deleteImage, deleteReplacedImage } from "@/lib/cloudinary";
import Course from "@/models/Course";
import CourseRating from "@/models/CourseRating";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { CourseForm } from "@/types/course";
import { normalizeCoursePayload } from "@/services/shared/courseMapper";
import "@/models/Category";
import "@/models/User";

type EnrollmentCount = { _id: unknown; count: number };
type LessonStat = {
  _id: unknown;
  lectureCount: number;
  totalDurationMinutes: number;
};

async function getCatalogStats() {
  const [enrollments, lessons] = await Promise.all([
    Enrollment.aggregate<EnrollmentCount>([
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
    Lesson.aggregate<LessonStat>([
      {
        $group: {
          _id: "$course",
          lectureCount: { $sum: 1 },
          totalDurationMinutes: { $sum: { $ifNull: ["$durationMinutes", 0] } },
        },
      },
    ]),
  ]);

  return {
    enrollmentMap: new Map(
      enrollments.map((item) => [String(item._id), item.count])
    ),
    lessonMap: new Map(lessons.map((item) => [String(item._id), item])),
    bestSellerCount: Math.max(0, ...enrollments.map((item) => item.count)),
  };
}

function enrichCourse(
  course: Record<string, unknown> & { _id: unknown },
  stats: Awaited<ReturnType<typeof getCatalogStats>>
) {
  const courseId = String(course._id);
  const enrollmentCount = stats.enrollmentMap.get(courseId) || 0;
  const lessonStat = stats.lessonMap.get(courseId);

  return {
    ...course,
    enrollmentCount,
    lectureCount: lessonStat?.lectureCount || 0,
    totalDurationMinutes: lessonStat?.totalDurationMinutes || 0,
    isBestSeller:
      stats.bestSellerCount > 0 && enrollmentCount === stats.bestSellerCount,
  };
}

export async function listPublicCourses() {
  await connectDB();
  const [courses, stats] = await Promise.all([
    Course.find({ published: true })
      .select("-thumbnailPublicId")
      .populate("category")
      .populate("teacher", "name image")
      .sort({ createdAt: -1 })
      .lean(),
    getCatalogStats(),
  ]);

  return courses.map((course) => enrichCourse(course, stats));
}

export async function listStudentCourses(studentId: string) {
  await connectDB();
  const [courses, enrollments] = await Promise.all([
    listPublicCourses(),
    Enrollment.find({ student: studentId }).select("course progress").lean(),
  ]);
  const enrollmentMap = new Map(
    enrollments.map((item) => [String(item.course), item.progress || 0])
  );

  return courses.map((course) => ({
    ...course,
    enrolled: enrollmentMap.has(String(course._id)),
    enrollmentProgress: enrollmentMap.get(String(course._id)) || 0,
  }));
}

export async function getPublicCourse(courseId: string, studentId?: string) {
  await connectDB();
  const [course, lessons, enrollmentCount, stats] = await Promise.all([
    Course.findOne({ _id: courseId, published: true })
      .select("-thumbnailPublicId")
      .populate("category")
      .populate("teacher", "name image")
      .lean(),
    Lesson.find({ course: courseId })
      .select("title order durationMinutes")
      .sort({ order: 1 })
      .lean(),
    Enrollment.countDocuments({ course: courseId }),
    getCatalogStats(),
  ]);
  if (!course) return null;

  const [enrollment, rating] = studentId
    ? await Promise.all([
        Enrollment.exists({ course: courseId, student: studentId }),
        CourseRating.findOne({ course: courseId, student: studentId })
          .select("rating")
          .lean(),
      ])
    : [null, null];

  return {
    course: enrichCourse({ ...course, enrollmentCount }, stats),
    lessons,
    isEnrolled: Boolean(enrollment),
    userRating: rating?.rating || 0,
  };
}

export async function listManagedCourses(
  scope: "admin" | "teacher",
  userId: string
) {
  await connectDB();
  return Course.find(scope === "teacher" ? { teacher: userId } : {})
    .populate("category")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });
}

export async function createCourseForTeacher(
  teacherId: string,
  payload: CourseForm
) {
  await connectDB();
  return Course.create({ ...normalizeCoursePayload(payload), teacher: teacherId });
}

export async function updateManagedCourse(
  filter: Record<string, unknown>,
  payload: CourseForm
) {
  await connectDB();
  const previous = await Course.findOne(filter).select("thumbnailPublicId");
  if (!previous) return null;

  const course = await Course.findOneAndUpdate(
    filter,
    normalizeCoursePayload(payload),
    { new: true, runValidators: true }
  );
  await deleteReplacedImage(
    previous.thumbnailPublicId,
    course?.thumbnailPublicId
  ).catch((error) => console.error("Could not delete replaced cover", error));
  return course;
}

export async function deleteManagedCourse(filter: Record<string, unknown>) {
  await connectDB();
  const course = await Course.findOneAndDelete(filter);
  if (!course) return null;

  await CourseRating.deleteMany({ course: course._id });
  await deleteImage(course.thumbnailPublicId).catch((error) =>
    console.error("Could not delete course cover", error)
  );
  return course;
}
