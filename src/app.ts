import { cors } from "hono/cors";
import { corsOrigins } from "./env.ts";
import { handleAppError } from "./lib/error-handler.ts";
import { factory } from "./lib/factory.ts";
import { registerOpenApi } from "./lib/openapi.ts";
import { requireToken } from "./middleware/auth.ts";
import { entriesRouter } from "./modules/entries/entries.index.ts";
import { summariesRouter } from "./modules/summaries/summaries.index.ts";
import { safetyRouter } from "./modules/safety/safety.index.ts";

/**
 * Scope: app.ts
 * Purpose: Hono application factory — wires CORS, auth middleware, module routers, and OpenAPI registration.
 */
export const app = factory.createApp();

app.onError(handleAppError);

app.use(
  "*",
  cors({
    // Empty (dev) = reflect any origin. Production: set CORS_ORIGINS.
    origin: corsOrigins.length > 0 ? corsOrigins : (origin) => origin,
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check (public, no token required).
app.get("/", (c) => c.text("Jeda API"));

// Bearer token gatekeeper for all data endpoints (PRD 8.2).
app.use("/api/*", requireToken);

app.route("/api/entries", entriesRouter);
app.route("/api/summaries", summariesRouter);
app.route("/api/safety", safetyRouter);

// OpenAPI spec + Scalar UI (also the source for Swift client generation).
registerOpenApi(app);
