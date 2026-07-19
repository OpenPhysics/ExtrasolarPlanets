/**
 * ExtrasolarPlanetsColors.ts
 *
 * Defines all dynamic colors for the simulation using ProfileColorProperty.
 *
 * Each color has two profiles:
 *   - "default"   — the standard light theme (matches the NAAP Flash look:
 *                   gray backdrop, white panels, dark text)
 *   - "projector" — used when the user enables Projector Mode in Preferences
 *                   (higher-contrast light palette for projection)
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
   * Light gray (the NAAP Flash simulator backdrop); pure white for projector use.
   */
  backgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "background", {
    default: "#cccccc",
    projector: "#ffffff",
  }),

  /**
   * Primary accent color for highlights, selected items, and key UI elements.
   * Deep blue on the light theme; darker navy for projector contrast.
   */
  accentColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "accent", {
    default: "#1565c0",
    projector: "#0d47a1",
  }),

  /**
   * Background fill for control panels and dialogs.
   * White cards on the gray backdrop; white in projector mode.
   */
  panelBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "panelBackground", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /**
   * Border/stroke color for control panels and dialogs.
   * Medium gray in default mode; darker gray in projector mode.
   */
  panelBorderColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "panelBorder", {
    default: "#999999",
    projector: "#666666",
  }),

  /**
   * Text color for labels, readouts, and general UI text.
   * Near-black on the light theme; pure black for projector contrast.
   */
  textColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "text", {
    default: "#1a1a1a",
    projector: "#000000",
  }),

  /**
   * Plotting-area background for the bamboo charts (slightly darker than the
   * screen background so the chart reads as a distinct surface).
   */
  chartBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "chartBackground", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /** Grid-line color inside the charts. Light gray in both modes. */
  chartGridColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "chartGrid", {
    default: "#cccccc",
    projector: "#dddddd",
  }),

  /** Color of the theoretical (predicted) curve drawn on the charts. */
  theoreticalCurveColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "theoreticalCurve", {
    default: "#1565c0",
    projector: "#0d47a1",
  }),

  /** Color of the vertical phase-indicator line that tracks the orbit. */
  phaseIndicatorColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "phaseIndicator", {
    default: "#d84315",
    projector: "#b71c1c",
  }),

  /** Color of the simulated-measurement scatter points on the charts. */
  measurementColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "measurement", {
    default: "#e65100",
    projector: "#bf360c",
  }),

  /** Color of the transit eclipse-duration arrow drawn across the light curve. */
  durationArrowColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "durationArrow", {
    default: "#6a1b9a",
    projector: "#4a148c",
  }),

  /** Host-star disk in the orbit/transit visualizations. */
  starColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "star", {
    default: "#ff9800",
    projector: "#e65100",
  }),

  /** Planet disk in the orbit/transit visualizations. */
  planetColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "planet", {
    default: "#607d8b",
    projector: "#37474f",
  }),

  /** Orbit ellipse/path drawn in the orbit visualizations. */
  orbitPathColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "orbitPath", {
    default: "#616161",
    projector: "#424242",
  }),

  /** Line-of-sight / observer indicator in the RV side & earth views. */
  lineOfSightColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "lineOfSight", {
    default: "#2e7d32",
    projector: "#1b5e20",
  }),

  /** Sky background for the transit visualization (deep space). */
  skyBackgroundColorProperty: new ProfileColorProperty(ExtrasolarPlanetsNamespace, "skyBackground", {
    default: "#000000",
    projector: "#222222",
  }),
};

export default ExtrasolarPlanetsColors;
