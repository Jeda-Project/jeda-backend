import type { ContentfulStatusCode } from "hono/utils/http-status";

// Base error domain — di-map ke HTTP status oleh handler global di app.ts.
export class DomainError extends Error {
  readonly status: ContentfulStatusCode;
  readonly code: string;

  constructor(
    message: string,
    status: ContentfulStatusCode = 400,
    code = "DOMAIN_ERROR",
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation failed") {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}
