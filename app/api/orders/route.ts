import { withApiHandler } from "@/lib/api/handler";
import { getOrdersAction } from "@/actions/server/orderActions";

export const GET = withApiHandler((req: Request) => {
  const searchParams = new URL(req.url).searchParams;
  return getOrdersAction({
    sessionId: searchParams.get("sessionId") || undefined,
    orderId: searchParams.get("orderId") || undefined,
  });
});
