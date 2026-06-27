/**
 * chartUtils.ts
 *
 * Small pure helpers shared by the two bamboo charts (Radial Velocity and
 * Transit Light Curve). They compute a "nice" tick spacing for an arbitrary
 * value range, derive how many decimal places the tick labels need, and turn a
 * sampled theoretical curve into the y-axis `Range` the chart should show.
 *
 * Bamboo's `GridLineSet` / `TickMarkSet` / `TickLabelSet` all take a model-space
 * spacing and lay ticks at `origin + n·spacing`; these helpers pick that spacing
 * and the matching label formatting so both charts stay legible as parameters
 * move.
 */

import { Range, toFixed, type Vector2 } from "scenerystack/dot";

/**
 * Pick a "nice" step (1, 2, or 5 × 10ⁿ) that yields roughly `targetDivisions`
 * segments across `rangeSpan`. Mirrors the standard D3 / "nice numbers"
 * algorithm so the charts get round tick values (e.g. 0, 20, 40, … not 17, 34…).
 */
export function niceStep(rangeSpan: number, targetDivisions = 5): number {
  const safeSpan = rangeSpan > 0 ? rangeSpan : 1;
  const raw = safeSpan / targetDivisions;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  let coefficient: number;
  if (normalized < 1.5) {
    coefficient = 1;
  } else if (normalized < 3) {
    coefficient = 2;
  } else if (normalized < 7) {
    coefficient = 5;
  } else {
    coefficient = 10;
  }
  return coefficient * magnitude;
}

/** Number of decimal places a tick label needs so it lines up with its step. */
export function decimalPlacesForStep(step: number): number {
  if (step <= 0 || !Number.isFinite(step)) {
    return 0;
  }
  return Math.max(0, -Math.floor(Math.log10(step)));
}

/** Format a tick value to a fixed number of decimals (uses dot's stable toFixed). */
export function formatTickValue(value: number, decimalPlaces: number): string {
  return toFixed(value, decimalPlaces);
}

/**
 * Y-axis `Range` for a sampled curve. The actual min/max of the data is padded
 * by 10 % so the curve does not touch the frame. Perfectly (or near-) flat
 * curves — e.g. a non-transiting geometry where flux is 1 everywhere, or a
 * vanishing-mass planet where K → 0 — collapse to a symmetric window of
 * `flatHalfWindow` around the centre so the chart never degenerates to a line.
 */
export function computeCurveYRange(curve: readonly Vector2[], flatHalfWindow: number): Range {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const point of curve) {
    const y = point.y;
    if (y < min) {
      min = y;
    }
    if (y > max) {
      max = y;
    }
  }
  if (!(Number.isFinite(min) && Number.isFinite(max))) {
    return new Range(-flatHalfWindow, flatHalfWindow);
  }

  const span = max - min;
  const center = (max + min) / 2;
  if (span < flatHalfWindow * 2e-3) {
    return new Range(center - flatHalfWindow, center + flatHalfWindow);
  }

  const pad = span * 0.1;
  return new Range(min - pad, max + pad);
}
