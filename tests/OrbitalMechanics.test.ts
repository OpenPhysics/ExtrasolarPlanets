/**
 * OrbitalMechanics.test.ts
 *
 * Verifies the pure two-body helpers against analytic results and the
 * faithfulness spot-checks called out in plan.md §7 (Kepler period, anomaly
 * round-trips, RV amplitude).
 */

import { describe, expect, it } from "vitest";
import {
  centerVelocity,
  eccentricToMeanAnomaly,
  eccentricToTrueAnomaly,
  keplerPeriodSeconds,
  kFactor,
  meanToEccentricAnomaly,
  meanToTrueAnomaly,
  phaseFromTrueAnomaly,
  radialVelocityAmplitude,
  trueToEccentricAnomaly,
  trueToMeanAnomaly,
} from "../src/common/OrbitalMechanics.js";
import { AU_M, M_SUN_KG, RV_M_JUP_KG, SECONDS_PER_DAY } from "../src/ExtrasolarPlanetsConstants.js";

const TWO_PI: number = 2 * Math.PI;

describe("keplerPeriodSeconds", () => {
  it("gives ~365.07 days for RV preset Option A (1 M☉ + 1 M_jup, 1 AU)", () => {
    // plan.md §3 spot-check: the planet's mass is part of the total, nudging the
    // period below the textbook 365.25 d to the verified 365.07 d.
    const periodDays = keplerPeriodSeconds(M_SUN_KG + RV_M_JUP_KG, AU_M) / SECONDS_PER_DAY;
    expect(periodDays).toBeCloseTo(365.07, 1);
  });

  it("gives the textbook 365.25 days for 1 AU around the Sun alone", () => {
    expect(keplerPeriodSeconds(M_SUN_KG, AU_M) / SECONDS_PER_DAY).toBeCloseTo(365.25, 0);
  });

  it("scales as a^1.5 (doubling a multiplies period by 2^1.5)", () => {
    const p1 = keplerPeriodSeconds(M_SUN_KG, AU_M);
    const p2 = keplerPeriodSeconds(M_SUN_KG, 2 * AU_M);
    expect(p2 / p1).toBeCloseTo(2 ** 1.5, 6);
  });
});

describe("kFactor", () => {
  it("is 1 for a circular orbit and grows with eccentricity", () => {
    expect(kFactor(0)).toBeCloseTo(1, 12);
    expect(kFactor(0.5)).toBeCloseTo(Math.sqrt(1.5 / 0.5), 12);
  });
});

describe("anomaly conversions", () => {
  for (const e of [0, 0.2, 0.5, 0.8]) {
    it(`round-trips mean → eccentric → mean for e=${e}`, () => {
      for (let i = 1; i < 12; i++) {
        const M = -Math.PI + (i / 12) * TWO_PI;
        const E = meanToEccentricAnomaly(M, e);
        // Kepler's equation must hold to the tightened tolerance.
        expect(eccentricToMeanAnomaly(E, e)).toBeCloseTo(M, 7);
      }
    });

    it(`round-trips true → eccentric → true for e=${e}`, () => {
      for (let i = 1; i < 12; i++) {
        const v = -Math.PI + (i / 12) * TWO_PI;
        const E = trueToEccentricAnomaly(v, e);
        expect(eccentricToTrueAnomaly(E, e)).toBeCloseTo(v, 9);
      }
    });
  }

  it("for e=0 mean anomaly equals true anomaly", () => {
    for (let i = 0; i < 8; i++) {
      const M = (i / 8) * TWO_PI;
      expect((meanToTrueAnomaly(M, 0) + TWO_PI) % TWO_PI).toBeCloseTo(M, 9);
    }
  });

  it("maps periapsis (ν=0) to phase 0 and apoapsis (ν=π) to phase 0.5", () => {
    expect(phaseFromTrueAnomaly(0, 0.3)).toBeCloseTo(0, 9);
    expect(phaseFromTrueAnomaly(Math.PI, 0.3)).toBeCloseTo(0.5, 9);
  });

  it("trueToMeanAnomaly inverts meanToTrueAnomaly", () => {
    const e = 0.4;
    for (let i = 1; i < 10; i++) {
      const M = (i / 10) * TWO_PI;
      const recovered = ((trueToMeanAnomaly(meanToTrueAnomaly(M, e), e) % TWO_PI) + TWO_PI) % TWO_PI;
      expect(recovered).toBeCloseTo(M, 7);
    }
  });
});

describe("radial velocity amplitude / center velocity", () => {
  it("K is positive, scales with sin i, and vanishes for a face-on orbit", () => {
    const P = keplerPeriodSeconds(M_SUN_KG, AU_M);
    const a1 = 1e9; // arbitrary star semi-major axis (m)
    const edgeOn = radialVelocityAmplitude(P, a1, Math.PI / 2, 0);
    const tilted = radialVelocityAmplitude(P, a1, Math.PI / 6, 0);
    expect(edgeOn).toBeGreaterThan(0);
    expect(tilted).toBeCloseTo(edgeOn * Math.sin(Math.PI / 6), 9);
    expect(radialVelocityAmplitude(P, a1, 0, 0)).toBeCloseTo(0, 12);
  });

  it("center velocity is zero for circular orbits and K·e·cosω otherwise", () => {
    expect(centerVelocity(50, 0, 1.2)).toBe(0);
    expect(centerVelocity(50, 0.4, 0)).toBeCloseTo(20, 9);
  });
});
