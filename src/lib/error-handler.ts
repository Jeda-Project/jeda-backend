import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { isProduction } from "../env.ts";
import { DomainError } from "./errors.ts";

// Handler error global (dipasang via app.onError). Memetakan DomainError ke
// status HTTP-nya, dan menjaga bentuk response { error, code } konsisten.
export function handleAppError(err: Error, c: Context) {
  if (err instanceof DomainError) {
    return c.json({ error: err.message, code: err.code }, err.status);
  }

  if (err instanceof HTTPException) {
    return c.json({ error: err.message, code: "HTTP_EXCEPTION" }, err.status);
  }

  console.error("[unhandled]", err);
  return c.json(
    {
      error: isProduction ? "Internal Server Error" : err.message,
      code: "INTERNAL_ERROR",
    },
    500,
  );
}
