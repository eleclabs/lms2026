import { withApiHandler } from "@/lib/api/handler";
import { getPublicCourseAction } from "@/actions/server/courseActions";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiHandler(
  async (_req: Request, context: RouteContext) => {
    const { id } = await context.params;
    return getPublicCourseAction(id);
  }
);
