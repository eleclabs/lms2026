import { withApiHandler } from "@/lib/api/handler";
import {
  createCouponAction,
  getCouponsAction,
} from "@/actions/server/couponActions";

export const GET = withApiHandler(getCouponsAction);
export const POST = withApiHandler(async (req: Request) =>
  createCouponAction(await req.json())
);
