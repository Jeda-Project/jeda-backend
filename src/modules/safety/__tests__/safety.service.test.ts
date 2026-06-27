import { describe, expect, test } from "bun:test";
import { KEYWORDS_VERSION } from "../safety.keywords.ts";
import { runScan } from "../safety.service.ts";

describe("safety.runScan — deterministik", () => {
  test("teks normal tidak ter-flag", () => {
    const result = runScan("Hari ini cukup produktif, ngoding fitur baru.");
    expect(result.flagged).toBe(false);
    expect(result.severity).toBe("none");
    expect(result.matches).toHaveLength(0);
    expect(result.resources).toHaveLength(0);
  });

  test("mendeteksi ide bunuh diri sebagai critical + sertakan resource", () => {
    const result = runScan("Aku ingin mengakhiri hidup ini, capek sekali.");
    expect(result.flagged).toBe(true);
    expect(result.severity).toBe("critical");
    expect(result.matches.some((m) => m.ruleId === "suicidal-ideation")).toBe(
      true,
    );
    expect(result.resources.length).toBeGreaterThan(0);
  });

  test("mendeteksi self-harm (high)", () => {
    const result = runScan("kadang pengen menyakiti diri sendiri");
    expect(result.flagged).toBe(true);
    expect(result.severity).toBe("high");
  });

  test("mendeteksi keputusasaan (medium)", () => {
    const result = runScan("rasanya semua sia-sia dan tidak ada harapan");
    expect(result.flagged).toBe(true);
    expect(result.severity).toBe("medium");
  });

  test("ambil severity tertinggi saat banyak match", () => {
    const result = runScan(
      "semua sia-sia, lebih baik mati saja, tidak ada harapan",
    );
    expect(result.severity).toBe("critical");
  });

  test("deteksi pola Bahasa Inggris", () => {
    const result = runScan("I just want to die");
    expect(result.flagged).toBe(true);
    expect(result.severity).toBe("critical");
  });

  test("hasil deterministik & menyertakan versi rules", () => {
    const a = runScan("ingin mati");
    const b = runScan("ingin mati");
    expect(a).toEqual(b);
    expect(a.rulesVersion).toBe(KEYWORDS_VERSION);
  });
});
