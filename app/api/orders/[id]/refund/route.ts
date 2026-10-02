import { withApiHandler } from "@/lib/api/handler";
import { refundOrderAction } from "@/actions/server/orderActions";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiHandler(
  async (_req: Request, context: RouteContext) => {
    const { id } = await context.params;
    return refundOrderAction(id);
  }
);
