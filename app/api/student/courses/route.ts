import { withApiHandler } from "@/lib/api/handler";
import { getStudentCoursesAction } from "@/actions/server/courseActions";

export const GET = withApiHandler(getStudentCoursesAction);
