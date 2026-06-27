import { generateSpecs } from "hono-openapi";
import { app } from "../app.ts";
import { openApiDocumentation } from "../lib/openapi.ts";

// Dumps the OpenAPI spec to openapi.json for Swift client generation:
//   openapi-generator-cli generate -i openapi.json -g swift6 -o ./ios-client
/**
 * Scope: generate-openapi.ts
 * Purpose: Dumps the OpenAPI spec to openapi.json for Swift client generation via openapi-generator-cli.
 */
const spec = await generateSpecs(app, {
  documentation: openApiDocumentation,
  excludeMethods: ["OPTIONS", "HEAD"],
});

const outPath = "openapi.json";
await Bun.write(outPath, JSON.stringify(spec, null, 2));
console.log(`[openapi] wrote ${outPath}`);
