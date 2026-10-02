import { withApiHandler } from "@/lib/api/handler";
import { createCheckoutAction } from "@/actions/server/checkoutActions";

export const POST = withApiHandler(async (req: Request) =>
  createCheckoutAction(req, await req.json())
);
