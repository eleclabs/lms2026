export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function assertApi(
  condition: unknown,
  status: number,
  message: string
): asserts condition {
  if (!condition) throw new ApiError(status, message);
}
