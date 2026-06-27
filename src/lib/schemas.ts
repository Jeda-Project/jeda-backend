import { resolver } from "hono-openapi";
import { z } from "zod";

// Standard error response shape across the API.
/**
 * Scope: schemas.ts
 * Purpose: Shared OpenAPI response schemas and helpers used across all route definitions.
 */
export const errorSchema = z
  .object({
    error: z.string(),
    code: z.string(),
  })
  .meta({ id: "Error" });

export type ErrorResponse = z.infer<typeof errorSchema>;

// Helper: wraps a Zod schema as an OpenAPI JSON response block.
export function jsonContent(
  schema: Parameters<typeof resolver>[0],
  description: string,
) {
  return {
    description,
    content: {
      "application/json": { schema: resolver(schema) },
    },
  };
}

// Helper: standard error response for a given status.
export function errorResponse(description: string) {
  return jsonContent(errorSchema, description);
}
