import { withApiHandler } from "@/lib/api/handler";
import { deleteCouponAction } from "@/actions/server/couponActions";

type RouteContext = { params: Promise<{ id: string }> };

export const DELETE = withApiHandler(
  async (_req: Request, context: RouteContext) => {
    const { id } = await context.params;
    return deleteCouponAction(id);
  }
);
