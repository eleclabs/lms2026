import { withApiHandler } from "@/lib/api/handler";
import { getManagedCoursesAction } from "@/actions/server/courseActions";

export const GET = withApiHandler(() => getManagedCoursesAction("admin"));
