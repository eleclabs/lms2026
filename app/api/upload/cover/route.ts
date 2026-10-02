import { withApiHandler } from "@/lib/api/handler";
import { uploadCourseCoverAction } from "@/actions/server/imageActions";

export const POST = withApiHandler(uploadCourseCoverAction);
