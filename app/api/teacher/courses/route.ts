import { withApiHandler } from "@/lib/api/handler";
import {
  createTeacherCourseAction,
  getManagedCoursesAction,
} from "@/actions/server/courseActions";

export const GET = withApiHandler(() => getManagedCoursesAction("teacher"));

export const POST = withApiHandler(async (req: Request) =>
  createTeacherCourseAction(await req.json())
);
