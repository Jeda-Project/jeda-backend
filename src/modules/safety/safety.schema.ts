import { z } from "zod";

export const severitySchema = z.enum(["none", "medium", "high", "critical"]);

export const scanMatchSchema = z
  .object({
    ruleId: z.string(),
    category: z.string(),
    severity: z.enum(["medium", "high", "critical"]),
  })
  .meta({ id: "SafetyScanMatch" });

export const crisisResourceSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    phone: z.string().optional(),
    url: z.string().optional(),
    available: z.string(),
  })
  .meta({ id: "CrisisResource" });

export const scanResultSchema = z
  .object({
    flagged: z.boolean(),
    severity: severitySchema,
    matches: z.array(scanMatchSchema),
    rulesVersion: z.string(),
    // Hanya terisi saat flagged=true (PRD 5.4: tampilkan resource langsung).
    resources: z.array(crisisResourceSchema),
  })
  .meta({ id: "SafetyScanResult" });

export const scanBodySchema = z
  .object({
    text: z.string().min(1).max(10_000),
  })
  .meta({ id: "SafetyScanBody" });

export const resourcesResponseSchema = z
  .object({
    resources: z.array(crisisResourceSchema),
  })
  .meta({ id: "CrisisResourcesResponse" });

export type ScanResult = z.infer<typeof scanResultSchema>;
export type ScanMatch = z.infer<typeof scanMatchSchema>;
