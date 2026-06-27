/**
 * StarProperties.test.ts
 *
 * Checks the main-sequence derivation chain against the canonical anchors from
 * plan.md §7: the Sun (G2V, ~5800 K, ~1 R☉), a low-mass M-dwarf, and the hot/cool
 * endpoints of the class-V spectral-type table (O7 / M6).
 */

import { describe, expect, it } from "vitest";
import { deriveStarProperties, luminosityFromMass, spectralTypeFromTemp } from "../src/common/StarProperties.js";
import { R_SUN_M } from "../src/ExtrasolarPlanetsConstants.js";

describe("luminosityFromMass", () => {
  it("gives L = 1 for the Sun", () => {
    expect(luminosityFromMass(1)).toBeCloseTo(1, 6);
  });

  it("uses the low-mass branch below 0.43 M☉", () => {
    // below the knee the 0.232·M^2.26 law applies — distinct from the M^3.99
    // extrapolation (which would under-predict here)
    expect(luminosityFromMass(0.2)).toBeCloseTo(0.232220431737728 * 0.2 ** 2.26, 9);
    expect(luminosityFromMass(0.2)).not.toBeCloseTo(0.2 ** 3.99, 4);
  });
});

describe("deriveStarProperties — the Sun (1 M☉)", () => {
  const sun = deriveStarProperties(1);

  it("has luminosity ≈ 1 L☉", () => {
    expect(sun.luminosity).toBeCloseTo(1, 6);
  });

  it("has temperature ≈ 5800 K", () => {
    expect(sun.temperatureK).toBeGreaterThan(5700);
    expect(sun.temperatureK).toBeLessThan(5900);
  });

  it("has radius ≈ 1 R☉ (and radiusM consistent)", () => {
    expect(sun.radiusSolarRadii).toBeCloseTo(1, 2);
    expect(sun.radiusM).toBeCloseTo(sun.radiusSolarRadii * R_SUN_M, 3);
  });

  it("is spectral type G2V", () => {
    expect(sun.spectralType?.label).toBe("G2V");
    expect(sun.spectralType?.letter).toBe("G");
  });
});

describe("deriveStarProperties — a 0.2 M☉ M-dwarf", () => {
  const dwarf = deriveStarProperties(0.2);

  it("is much fainter and cooler than the Sun", () => {
    expect(dwarf.luminosity).toBeLessThan(0.05);
    expect(dwarf.temperatureK).toBeLessThan(4000);
    expect(dwarf.temperatureK).toBeGreaterThan(2800);
  });

  it("classifies as a cool (K or M) dwarf", () => {
    expect(["K", "M"]).toContain(dwarf.spectralType?.letter);
  });
});

describe("spectralTypeFromTemp — table endpoints", () => {
  it("maps 38000 K to O7V (hot end)", () => {
    expect(spectralTypeFromTemp(38000)?.label).toBe("O7V");
  });

  it("maps 2850 K to M6V (cool end)", () => {
    expect(spectralTypeFromTemp(2850)?.label).toBe("M6V");
  });

  it("returns null for an off-the-chart temperature", () => {
    expect(spectralTypeFromTemp(200000)).toBeNull();
  });
});
