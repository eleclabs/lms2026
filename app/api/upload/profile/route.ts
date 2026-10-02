import { withApiHandler } from "@/lib/api/handler";
import { uploadProfileImageAction } from "@/actions/server/imageActions";

export const POST = withApiHandler(uploadProfileImageAction);
