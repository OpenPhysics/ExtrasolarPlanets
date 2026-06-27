/**
 * RandomUtils.ts
 *
 * Gaussian noise generator matching the NAAP Flash simulators. Both
 * `Radial Velocity Component.as` and `Lightcurve Component II.as` draw normal
 * deviates with the **Marsaglia polar method** (reject-sample a point in the
 * unit disc, then scale) — NOT the trigonometric Box–Muller form. Reproducing
 * the exact algorithm keeps the measurement scatter faithful (plan.md §8).
 *
 *   do { x1 = 2r−1; x2 = 2r−1; s = x1²+x2² } while (s ≥ 1);
 *   factor = √(−2·ln s / s);   deviate = x1 · factor
 *
 * The uniform source is injectable so tests are deterministic; it defaults to
 * SceneryStack's shared `dotRandom`.
 */

import { dotRandom } from "scenerystack/dot";

/** A function returning a uniform random number in [0, 1). */
export type UniformSource = () => number;

/**
 * Draw one Gaussian-distributed value with the given mean and standard
 * deviation using the Marsaglia polar method.
 *
 * @param mean - distribution mean
 * @param stdDev - standard deviation (σ); the Flash measurement noise is passed
 *   directly as σ (there is no `max(σ, …)` floor — plan.md §8)
 * @param nextDouble - uniform [0,1) source; defaults to `dotRandom.nextDouble()`
 */
export function polarGaussian(
  mean: number,
  stdDev: number,
  nextDouble: UniformSource = () => dotRandom.nextDouble(),
): number {
  let x1 = 0;
  let s = 0;
  do {
    x1 = 2 * nextDouble() - 1;
    const x2 = 2 * nextDouble() - 1;
    s = x1 * x1 + x2 * x2;
  } while (s >= 1); // exact Flash condition (rejects s ≥ 1; s = 0 is left to the caller's RNG)
  const factor = Math.sqrt((-2 * Math.log(s)) / s);
  return mean + stdDev * x1 * factor;
}
