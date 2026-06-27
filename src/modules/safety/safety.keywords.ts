// DETERMINISTIC & auditable crisis pattern list (PRD 5.4).
// IMPORTANT: no generative/AI component here. Every change to this list must go through review.
// Bump KEYWORDS_VERSION on every change.
/**
 * Scope: safety.keywords.ts
 * Purpose: Deterministic, auditable crisis pattern rules — no AI component. Bump KEYWORDS_VERSION on every change.
 */
export const KEYWORDS_VERSION = "2026-06-27.1";

export type Severity = "critical" | "high" | "medium";

export interface CrisisRule {
  id: string;
  category: string;
  severity: Severity;
  // Patterns are matched against normalized (lowercase) text.
  patterns: RegExp[];
}

export const CRISIS_RULES: readonly CrisisRule[] = [
  {
    id: "suicidal-ideation",
    category: "Ide bunuh diri / mengakhiri hidup",
    severity: "critical",
    patterns: [
      /\bbunuh diri\b/,
      /\bingin (mati|mengakhiri hidup|menghilang selamanya)\b/,
      /\b(tidak|nggak|gak|ga) (ingin|mau|pengen) hidup\b/,
      /\b(lebih baik|mending) (mati|gak ada)\b/,
      /\bmengakhiri (hidup|semua)( ini)?\b/,
      /\bkill myself\b/,
      /\b(want|wanna) to die\b/,
      /\bend (my|it all|my life)\b/,
      /\bsuicid(e|al)\b/,
    ],
  },
  {
    id: "self-harm",
    category: "Menyakiti diri sendiri",
    severity: "high",
    patterns: [
      /\b(menyakiti|melukai) diri( sendiri)?\b/,
      /\bself[\s-]?harm\b/,
      /\bcutting myself\b/,
      /\b(nyilet|menyilet)\b/,
    ],
  },
  {
    id: "hopelessness",
    category: "Keputusasaan ekstrem / sinyal linguistik berisiko",
    severity: "medium",
    patterns: [
      /\b(tidak|nggak|gak|ga) ada (harapan|gunanya|jalan keluar)\b/,
      /\bsemua(nya)? (sia-sia|percuma)\b/,
      /\bputus asa\b/,
      /\bhopeless\b/,
      /\bno (way out|point|reason to live)\b/,
      /\bgive up on (life|everything)\b/,
    ],
  },
] as const;
