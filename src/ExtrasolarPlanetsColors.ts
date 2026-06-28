/**
 * ExtrasolarPlanetsColors.ts
 *
 * Defines all dynamic colors for the simulation using ProfileColorProperty.
 *
 * Each color has two profiles:
 *   - "default"   — used in standard (dark) mode
 *   - "projector" — used when the user enables Projector Mode in Preferences
 *
 * SceneryStack switches profiles automatically; no manual toggling is needed.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * Import ExtrasolarPlanetsColors and pass properties directly to Node's fillProperty or
 * strokeProperty options:
 *
 *   import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
 *
 *   new Rectangle( 0, 0, 100, 50, {
 *     fillProperty: ExtrasolarPlanetsColors.backgroundColorProperty,
 *   });
 *
 * ── How to add a color ────────────────────────────────────────────────────────
 * Add a new ProfileColorProperty entry to the ExtrasolarPlanetsColors object below.
 * Always provide both "default" and "projector" values.
 */
import { ProfileColorProperty } from "scenerystack/scenery";
import ExtrasolarPlanetsNamespace from "./ExtrasolarPlanetsNamespace.js";

const ExtrasolarPlanetsColors = {
  /**
   * Background color for the simulation screen.
   * Deep navy in default mode; white in projector mode.
   */
  backgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "background", {
    default: "#1a1a2e",
    projector: "#ffffff",
  }),

  /**
   * Primary accent color for highlights, selected items, and key UI elements.
   * Sky blue in default mode; dark navy in projector mode.
   */
  accentColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "accent", {
    default: "#4fc3f7",
    projector: "#1a1a2e",
  }),

  /**
   * Background fill for control panels and dialogs.
   * Deep blue in default mode; light gray in projector mode.
   */
  panelBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "panelBackground", {
    default: "#16213e",
    projector: "#f5f5f5",
  }),

  /**
   * Border/stroke color for control panels and dialogs.
   * Teal-navy in default mode; medium gray in projector mode.
   */
  panelBorderColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "panelBorder", {
    default: "#0f3460",
    projector: "#999999",
  }),

  /**
   * Text color for labels, readouts, and general UI text.
   * Near-white in default mode; near-black in projector mode.
   */
  textColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "text", {
    default: "#e0e0e0",
    projector: "#1a1a1a",
  }),

  /**
   * Plotting-area background for the bamboo charts (slightly darker than the
   * screen background so the chart reads as a distinct surface).
   */
  chartBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "chartBackground", {
    default: "#0d1117",
    projector: "#ffffff",
  }),

  /** Grid-line color inside the charts. Dim navy in default mode; light gray in projector. */
  chartGridColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "chartGrid", {
    default: "#2a3a5a",
    projector: "#dddddd",
  }),

  /** Color of the theoretical (predicted) curve drawn on the charts. */
  theoreticalCurveColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "theoreticalCurve", {
    default: "#4fc3f7",
    projector: "#1565c0",
  }),

  /** Color of the vertical phase-indicator line that tracks the orbit. */
  phaseIndicatorColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "phaseIndicator", {
    default: "#ffca28",
    projector: "#e65100",
  }),

  /** Color of the simulated-measurement scatter points on the charts. */
  measurementColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "measurement", {
    default: "#ffb74d",
    projector: "#c43c00",
  }),

  /** Color of the transit eclipse-duration arrow drawn across the light curve. */
  durationArrowColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "durationArrow", {
    default: "#ff8a65",
    projector: "#b71c1c",
  }),

  /** Host-star disk in the orbit/transit visualizations. */
  starColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "star", {
    default: "#ffd54f",
    projector: "#e65100",
  }),

  /** Planet disk in the orbit/transit visualizations. */
  planetColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "planet", {
    default: "#90a4ae",
    projector: "#37474f",
  }),

  /** Orbit ellipse/path drawn in the orbit visualizations. */
  orbitPathColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "orbitPath", {
    default: "#546e7a",
    projector: "#9e9e9e",
  }),

  /** Line-of-sight / observer indicator in the RV side & earth views. */
  lineOfSightColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "lineOfSight", {
    default: "#81c784",
    projector: "#2e7d32",
  }),

  /** Sky background for the transit visualization (deep space). */
  skyBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "skyBackground", {
    default: "#000000",
    projector: "#222222",
  }),
};

export default ExtrasolarPlanetsColors;
