export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message, "FORBIDDEN");
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message, "NOT_FOUND");
  }

  static badRequest(message: string) {
    return new ApiError(400, message, "BAD_REQUEST");
  }
}

interface ErrorResponseBody {
  error: string;
  code?: string;
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    const body: ErrorResponseBody = { error: error.message };
    if (error.code) body.code = error.code;
    return Response.json(body, { status: error.statusCode });
  }

  console.error("Unhandled API error:", error);
  return Response.json(
    { error: "Internal server error", code: "INTERNAL_ERROR" } satisfies ErrorResponseBody,
    { status: 500 }
  );
}

export function unauthorizedResponse(): Response {
  return Response.json(
    { error: "Unauthorized", code: "UNAUTHORIZED" } satisfies ErrorResponseBody,
    { status: 401 }
  );
}

export function validationErrorResponse(fieldErrors: Record<string, string[] | undefined>): Response {
  return Response.json({ error: fieldErrors, code: "VALIDATION_ERROR" }, { status: 400 });
}
