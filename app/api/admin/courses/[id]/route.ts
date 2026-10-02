import { withApiHandler } from "@/lib/api/handler";
import {
  deleteCourseAction,
  updateCourseAction,
} from "@/actions/server/courseActions";

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withApiHandler(
  async (req: Request, context: RouteContext) => {
    const { id } = await context.params;
    return updateCourseAction("admin", id, await req.json());
  }
);

export const DELETE = withApiHandler(
  async (_req: Request, context: RouteContext) => {
    const { id } = await context.params;
    return deleteCourseAction("admin", id);
  }
);
