import { describe, expect, test } from "bun:test";
import { shouldRunIntegrationTests } from "../../../test/config.ts";

// Integration test — requires a real Neon DB (RUN_INTEGRATION_TESTS=1 + DATABASE_URL).
// Skipped by default to keep `bun test` green without a database.
/**
 * Scope: entries.routes.test.ts
 * Purpose: Integration tests for entries routes — requires a live Neon DB, gated by RUN_INTEGRATION_TESTS=1.
 */
const describeIntegration = shouldRunIntegrationTests()
  ? describe
  : describe.skip;

describeIntegration("entries routes (integration)", () => {
  test("POST /api/entries saves and returns safety scan", async () => {
    const { app } = await import("../../../app.ts");
    const token = process.env.API_BEARER_TOKEN!;

    const res = await app.request("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: "hari ini cukup melelahkan" }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as {
      entry: { id: string };
      safety: { flagged: boolean };
    };
    expect(json.entry.id).toBeString();
    expect(json.safety.flagged).toBe(false);
  });

  test("POST /api/entries tanpa token => 401", async () => {
    const { app } = await import("../../../app.ts");
    const res = await app.request("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "x" }),
    });
    expect(res.status).toBe(401);
  });
});
