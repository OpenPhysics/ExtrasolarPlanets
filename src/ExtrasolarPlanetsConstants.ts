/**
 * ExtrasolarPlanetsConstants.ts
 *
 * Central repository for every named numeric constant used across the
 * simulation. Bare numbers that carry semantic meaning (sizes, margins,
 * physics defaults, ranges) belong here rather than inline in model or view
 * code, so they are named, documented, and changed in one place.
 *
 * Conventions
 * ───────────
 *  - Physics / model values use SI units (metres, seconds, kilograms, …);
 *    note the unit in a comment on each value.
 *  - Layout / chrome values are in screen pixels.
 *  - Colour strings live in ExtrasolarPlanetsColors.ts, not here.
 *  - Computed expressions (e.g. `2 * Math.PI`) may stay inline.
 *
 * The physics constants are transcribed verbatim from the original NAAP Flash
 * simulators (`radialVelocitySimulator012`, `transitSimulator017`) so the
 * SceneryStack port reproduces their numbers exactly. See `plan.md`.
 */

import { Range } from "scenerystack/dot";
import ExtrasolarPlanetsNamespace from "./ExtrasolarPlanetsNamespace.js";

// ── Layout / chrome (screen pixels) ───────────────────────────────────────────

/** Margin between the screen edge and edge-anchored controls (e.g. Reset All). */
export const SCREEN_VIEW_MARGIN = 20;

/** Corner radius shared by control panels and dialogs. */
export const PANEL_CORNER_RADIUS = 6;

/** Plotting area (px) for the radial-velocity / light-curve bamboo charts. */
export const CHART_VIEW_WIDTH = 420;
export const CHART_VIEW_HEIGHT = 230;

/** Square pixel size of each orbit / transit visualization sub-view. */
export const ORBIT_VIEW_SIZE = 220;

/**
 * Number of samples used to draw a theoretical curve (RV velocity / transit
 * flux) across one orbital phase [0, 1]. The curve has SAMPLES + 1 points.
 */
export const CHART_CURVE_SAMPLES = 200;

// ── Shared physics constants (SI units; exact Flash values) ───────────────────

/** Gravitational constant (m³ kg⁻¹ s⁻²) — the Flash value, not CODATA. */
export const G_SI = 6.673e-11;

/** Solar mass (kg). */
export const M_SUN_KG = 1.98892e30;

/** Solar radius (m). */
export const R_SUN_M = 6.955e8;

/** Astronomical unit (m). */
export const AU_M = 1.49598e11;

/** Seconds in one day. */
export const SECONDS_PER_DAY = 86400;

/** 4·π², precomputed to the exact Flash literal used in Kepler's third law. */
export const FOUR_PI_SQUARED = 39.47841760435743;

/**
 * Jupiter mass (kg). The two simulators use slightly different values; this is a
 * deliberate fidelity quirk preserved from the originals — do NOT unify them.
 */
export const RV_M_JUP_KG = 1.899e27; // radialVelocitySimulator012
export const TRANSIT_M_JUP_KG = 1.8987e27; // transitSimulator017

/** Jupiter radius (m) — transit screen. */
export const R_JUP_M = 7.1492e7;

/** Fixed planet blackbody temperature (K) used by the transit flux model. */
export const PLANET_TEMP_K = 500;

/**
 * Blackbody → visual-flux constant (the `1.89553328524593e-43` literal from
 * `EclipsingBinary.as` / `Lightcurve Component II.as`).
 */
export const FLUX_CONSTANT = 1.89553328524593e-43;

/**
 * Newton's-method convergence tolerance for Kepler's equation. The Flash sources
 * iterate to 1e-3; we tighten to 1e-8 (documented fidelity decision in plan.md
 * §8) — strictly more accurate, same algorithm and seed (E₀ = M).
 */
export const KEPLER_TOLERANCE = 1e-8;

/** Hard cap on Kepler Newton iterations (Flash used 100). */
export const KEPLER_MAX_ITERATIONS = 100;

// ── Radial Velocity screen — slider ranges + defaults ─────────────────────────
// Ranges/defaults transcribed from the slider `on(initialize)` records and the
// reset handler (DoAction_7) of radialVelocitySimulator012.

export const RV_PLANET_MASS_RANGE = new Range(0.001, 100); // M_jupiter
export const RV_PLANET_MASS_DEFAULT = 1;

export const RV_STAR_MASS_RANGE = new Range(0.2, 2); // M_sun
export const RV_STAR_MASS_DEFAULT = 1;

export const RV_SEMIMAJOR_AXIS_RANGE = new Range(0.01, 10); // AU
export const RV_SEMIMAJOR_AXIS_DEFAULT = 1;

export const RV_ECCENTRICITY_RANGE = new Range(0, 0.8);
export const RV_ECCENTRICITY_DEFAULT = 0.2;

export const RV_INCLINATION_RANGE = new Range(0, 180); // degrees
export const RV_INCLINATION_DEFAULT = 90;

export const RV_LONGITUDE_RANGE = new Range(0, 360); // degrees
export const RV_LONGITUDE_DEFAULT = 45;

export const RV_NOISE_RANGE = new Range(1, 100); // m/s
export const RV_NOISE_DEFAULT = 15;

export const RV_NUMBER_OF_MEASUREMENTS_RANGE = new Range(10, 300);
export const RV_NUMBER_OF_MEASUREMENTS_DEFAULT = 150;

export const RV_PHASE_RANGE = new Range(0, 1);
export const RV_PHASE_DEFAULT = 0;

export const RV_ANIMATION_SPEED_RANGE = new Range(0.00001, 0.001);
export const RV_ANIMATION_SPEED_DEFAULT = 0.0005;

// ── Transit screen — slider ranges + defaults ─────────────────────────────────
// Transcribed from transitSimulator017 slider records + onResetClicked (DoAction_3).

export const TRANSIT_PLANET_MASS_RANGE = new Range(0.001, 100); // M_jupiter
export const TRANSIT_PLANET_MASS_DEFAULT = 0.657;

export const TRANSIT_PLANET_RADIUS_RANGE = new Range(0.01, 2); // R_jupiter
export const TRANSIT_PLANET_RADIUS_DEFAULT = 1.32;

export const TRANSIT_STAR_MASS_RANGE = new Range(0.5, 2); // M_sun
export const TRANSIT_STAR_MASS_DEFAULT = 1.09;

export const TRANSIT_SEMIMAJOR_AXIS_RANGE = new Range(0.015, 2); // AU
export const TRANSIT_SEMIMAJOR_AXIS_DEFAULT = 0.047;

export const TRANSIT_ECCENTRICITY_RANGE = new Range(0, 0.4);
export const TRANSIT_ECCENTRICITY_DEFAULT = 0;

export const TRANSIT_INCLINATION_RANGE = new Range(0, 180); // degrees
export const TRANSIT_INCLINATION_DEFAULT = 86.929;

export const TRANSIT_LONGITUDE_RANGE = new Range(0, 360); // degrees
export const TRANSIT_LONGITUDE_DEFAULT = 0;

export const TRANSIT_PHASE_RANGE = new Range(0, 1);
export const TRANSIT_PHASE_DEFAULT = 0.5;

export const TRANSIT_NOISE_RANGE = new Range(0.00001, 0.2);
export const TRANSIT_NOISE_DEFAULT = 0.1;

export const TRANSIT_NUMBER_OF_MEASUREMENTS_RANGE = new Range(5, 250);
export const TRANSIT_NUMBER_OF_MEASUREMENTS_DEFAULT = 50;

export const TRANSIT_ANIMATION_SPEED_RANGE = new Range(0.00001, 0.001);
export const TRANSIT_ANIMATION_SPEED_DEFAULT = 0.0005;

/**
 * Flux-noise value fed to the chart when measurements are hidden — only sets the
 * plot's y-axis margin so the curve fills the view (it is not a measurement
 * floor). Verbatim `noMeasurementsNoise` from transitSimulator017.
 */
export const TRANSIT_NO_MEASUREMENTS_NOISE = 0.00001;

/** Pixel radius of the planet disk in the transit visualization (kept visible). */
export const TRANSIT_PLANET_VIEW_RADIUS = 6;
/** Pixel radius of the star disk in the transit visualization. */
export const TRANSIT_STAR_VIEW_RADIUS = 38;

ExtrasolarPlanetsNamespace.register("ExtrasolarPlanetsConstants", {
  SCREEN_VIEW_MARGIN,
  PANEL_CORNER_RADIUS,
  CHART_VIEW_WIDTH,
  CHART_VIEW_HEIGHT,
  ORBIT_VIEW_SIZE,
  CHART_CURVE_SAMPLES,
  G_SI,
  M_SUN_KG,
  R_SUN_M,
  AU_M,
  SECONDS_PER_DAY,
  FOUR_PI_SQUARED,
  RV_M_JUP_KG,
  TRANSIT_M_JUP_KG,
  R_JUP_M,
  PLANET_TEMP_K,
  FLUX_CONSTANT,
  KEPLER_TOLERANCE,
  KEPLER_MAX_ITERATIONS,
  RV_ANIMATION_SPEED_DEFAULT,
  TRANSIT_ANIMATION_SPEED_DEFAULT,
  TRANSIT_PLANET_VIEW_RADIUS,
  TRANSIT_STAR_VIEW_RADIUS,
});
