import { withApiHandler } from "@/lib/api/handler";
import { getPublicCoursesAction } from "@/actions/server/courseActions";

export const GET = withApiHandler(getPublicCoursesAction);
