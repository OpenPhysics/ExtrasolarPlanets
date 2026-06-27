/**
 * RandomUtils.test.ts
 *
 * Confirms the Marsaglia polar Gaussian: reproducibility under a fixed uniform
 * source, and convergence to the requested mean/variance over many draws.
 */

import { describe, expect, it } from "vitest";
import { polarGaussian } from "../src/common/RandomUtils.js";

/** Deterministic, seedable uniform [0,1) source (mulberry32) for stable tests. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("polarGaussian", () => {
  it("is reproducible for a given uniform sequence", () => {
    const a = polarGaussian(0, 1, mulberry32(42));
    const b = polarGaussian(0, 1, mulberry32(42));
    expect(a).toBe(b);
  });

  it("produces different values as the source advances", () => {
    const rng = mulberry32(7);
    const first = polarGaussian(0, 1, rng);
    const second = polarGaussian(0, 1, rng);
    expect(first).not.toBe(second);
  });

  it("converges to the requested mean and standard deviation", () => {
    const rng = mulberry32(12345);
    const mean = 4;
    const stdDev = 2.5;
    const n = 50000;
    let sum = 0;
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const x = polarGaussian(mean, stdDev, rng);
      sum += x;
      sumSq += x * x;
    }
    const sampleMean = sum / n;
    const sampleVar = sumSq / n - sampleMean * sampleMean;
    expect(sampleMean).toBeCloseTo(mean, 1);
    expect(Math.sqrt(sampleVar)).toBeCloseTo(stdDev, 1);
  });

  it("returns exactly the mean when stdDev is zero", () => {
    expect(polarGaussian(3.3, 0, mulberry32(99))).toBe(3.3);
  });

  it("uses dotRandom by default (returns a finite number)", () => {
    const x = polarGaussian(0, 1);
    expect(Number.isFinite(x)).toBe(true);
  });
});
