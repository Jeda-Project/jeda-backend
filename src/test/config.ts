// Tests that require a database/Neon only run when RUN_INTEGRATION_TESTS=1.
// Unit tests (e.g. safety) always run without external dependencies.
/**
 * Scope: config.ts
 * Purpose: Test environment helpers — controls integration test gating via RUN_INTEGRATION_TESTS env var.
 */

export function shouldRunIntegrationTests(): boolean {
  return process.env.RUN_INTEGRATION_TESTS === "1";
}
