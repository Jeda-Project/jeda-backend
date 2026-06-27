import {
  CRISIS_RULES,
  KEYWORDS_VERSION,
  type Severity,
} from "./safety.keywords.ts";
import { CRISIS_RESOURCES } from "./safety.resources.ts";
import type { ScanMatch, ScanResult } from "./safety.schema.ts";

const SEVERITY_RANK: Record<Severity, number> = {
  medium: 1,
  high: 2,
  critical: 3,
};

// Normalisasi ringan: lowercase + rapikan whitespace. Tetap deterministik.
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// Deteksi krisis DETERMINISTIK (PRD 5.4). Tidak ada AI generatif di sini —
// murni keyword/regex matching sehingga hasilnya dapat diaudit & direproduksi.
export function runScan(text: string): ScanResult {
  const normalized = normalize(text);
  const matches: ScanMatch[] = [];

  for (const rule of CRISIS_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      matches.push({
        ruleId: rule.id,
        category: rule.category,
        severity: rule.severity,
      });
    }
  }

  const flagged = matches.length > 0;
  const severity = flagged
    ? matches.reduce<Severity>(
        (max, m) =>
          SEVERITY_RANK[m.severity] > SEVERITY_RANK[max] ? m.severity : max,
        "medium",
      )
    : "none";

  return {
    flagged,
    severity,
    matches,
    rulesVersion: KEYWORDS_VERSION,
    // Saat krisis terdeteksi, sertakan resource langsung (PRD 5.4).
    resources: flagged ? [...CRISIS_RESOURCES] : [],
  };
}
