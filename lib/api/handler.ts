import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { DatabaseConnectionError } from "@/lib/mongodb";

type RouteResult = Response | Record<string, unknown> | unknown[] | null;

export function withApiHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<RouteResult>
) {
  return async (...args: Args) => {
    try {
      const result = await handler(...args);
      return result instanceof Response ? result : NextResponse.json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.status }
        );
      }

      if (error instanceof DatabaseConnectionError) {
        console.error("Database connection unavailable", error.cause);
        return NextResponse.json(
          {
            message:
              "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่",
          },
          { status: 503 }
        );
      }

      console.error("Unhandled API error", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดภายในระบบ" },
        { status: 500 }
      );
    }
  };
}
