// Professional support resources shown on crisis detection (PRD 5.4).
// Displayed immediately without waiting for user confirmation.
// List is Indonesia-specific — update from official sources as needed.
/**
 * Scope: safety.resources.ts
 * Purpose: Static list of professional crisis support resources shown to the user on critical/high detection.
 */

export interface CrisisResource {
  name: string;
  description: string;
  phone?: string;
  url?: string;
  available: string;
}

export const CRISIS_RESOURCES: readonly CrisisResource[] = [
  {
    name: "Hotline Kementerian Kesehatan (SEJIWA)",
    description: "Layanan konseling sehat jiwa nasional.",
    phone: "119 ext 8",
    available: "24 jam",
  },
  {
    name: "Into The Light Indonesia",
    description:
      "Komunitas pencegahan bunuh diri & kesehatan mental berbasis riset.",
    url: "https://www.intothelightid.org/tentang-bunuh-diri/units/",
    available: "Lihat daftar layanan di situs",
  },
  {
    name: "LISA Suicide Prevention Helpline",
    description: "Helpline pencegahan bunuh diri (Bahasa Indonesia & Inggris).",
    phone: "+62 811 3855 472",
    available: "Setiap hari",
  },
] as const;
