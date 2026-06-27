/**
 * TransitChartNode.ts
 *
 * The bamboo light-curve chart for the Transit screen: normalized flux
 * (1 = unocculted star) on the y-axis versus orbital phase (0–1) on the x-axis.
 * It draws the theoretical flux curve as a `LinePlot` and a vertical phase
 * indicator that tracks `phaseProperty`.
 *
 * Because the transit dip is shallow (typically 1–2 %) the y-axis auto-scales
 * tightly around the curve (±10 % of the dip), collapsing to a small ±1 % window
 * around 1.0 for non-transiting geometries so the flat line still reads as a
 * line and not a degenerate sliver. A horizontal reference line marks flux = 1.
 *
 * The eclipse-duration arrow, depth-readout wiring, and preset combo box
 * arrive in later milestones (M5).
 */

import type { TReadOnlyProperty } from "scenerystack/axon";
import {
  AxisLine,
  ChartRectangle,
  ChartTransform,
  GridLineSet,
  LinePlot,
  ScatterPlot,
  TickLabelSet,
  TickMarkSet,
} from "scenerystack/bamboo";
import { Range, Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { Orientation } from "scenerystack/phet-core";
import { Line, Node, Text } from "scenerystack/scenery";
import { computeCurveYRange, decimalPlacesForStep, formatTickValue, niceStep } from "../../common/view/chartUtils.js";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import { CHART_VIEW_HEIGHT, CHART_VIEW_WIDTH } from "../../ExtrasolarPlanetsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { TransitModel } from "../model/TransitModel.js";

// ── Layout (px) ──────────────────────────────────────────────────────────────
const PHASE_AXIS_SPACING = 0.25; // ticks at 0, 0.25, 0.5, 0.75, 1
/** Half-height (flux) of the y-window used when there is no transit (flat @ 1). */
const FLAT_HALF_WINDOW_FLUX = 0.01;
/** Room for the y-axis tick labels to the left of the plotting area. */
const CHART_LEFT_PADDING = 54;
/** Room for the chart title above the plotting area. */
const CHART_TOP_PADDING = 28;

const TICK_LABEL_FONT = "12px sans-serif";
const TITLE_FONT = "14px sans-serif";

/** Format a phase tick (0, 0.25, 0.5, 0.75, 1) without trailing zeros. */
function formatPhase(value: number): string {
  return String(Math.round(value * 100) / 100);
}

export class TransitChartNode extends Node {
  public constructor(model: TransitModel) {
    const chartStrings = StringManager.getInstance().getTransitStrings().chart;

    // ── Chart transform + frame ────────────────────────────────────────────────
    const chartTransform = new ChartTransform({
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range(0, 1),
      modelYRange: new Range(1 - FLAT_HALF_WINDOW_FLUX, 1 + FLAT_HALF_WINDOW_FLUX),
    });

    const chartRectangle = new ChartRectangle(chartTransform, {
      fill: ExtrasolarPlanetsColors.chartBackgroundColorProperty,
      stroke: ExtrasolarPlanetsColors.chartGridColorProperty,
      lineWidth: 1,
    });

    const xGrid = new GridLineSet(chartTransform, Orientation.HORIZONTAL, PHASE_AXIS_SPACING, {
      stroke: ExtrasolarPlanetsColors.chartGridColorProperty,
    });
    const yGrid = new GridLineSet(chartTransform, Orientation.VERTICAL, niceStep(2 * FLAT_HALF_WINDOW_FLUX), {
      stroke: ExtrasolarPlanetsColors.chartGridColorProperty,
    });

    const xTicks = new TickMarkSet(chartTransform, Orientation.HORIZONTAL, PHASE_AXIS_SPACING, {
      edge: "min",
      stroke: ExtrasolarPlanetsColors.textColorProperty,
      extent: 6,
    });
    const yTicks = new TickMarkSet(chartTransform, Orientation.VERTICAL, niceStep(2 * FLAT_HALF_WINDOW_FLUX), {
      edge: "min",
      stroke: ExtrasolarPlanetsColors.textColorProperty,
      extent: 6,
    });

    const xLabels = new TickLabelSet(chartTransform, Orientation.HORIZONTAL, PHASE_AXIS_SPACING, {
      edge: "min",
      extent: 6,
      createLabel: (value) =>
        new Text(formatPhase(value), { font: TICK_LABEL_FONT, fill: ExtrasolarPlanetsColors.textColorProperty }),
    });
    const yLabels = new TickLabelSet(chartTransform, Orientation.VERTICAL, niceStep(2 * FLAT_HALF_WINDOW_FLUX), {
      edge: "min",
      extent: 6,
      createLabel: (value) =>
        new Text(formatTickValue(value, 2), { font: TICK_LABEL_FONT, fill: ExtrasolarPlanetsColors.textColorProperty }),
    });

    // Flux = 1 baseline reference (the unocculted level).
    const baselineAxis = new AxisLine(chartTransform, Orientation.HORIZONTAL, {
      value: 1,
      stroke: ExtrasolarPlanetsColors.textColorProperty,
      lineWidth: 1,
    });

    // ── Theoretical flux curve ─────────────────────────────────────────────────
    const fluxPlot = new LinePlot(chartTransform, [], {
      stroke: ExtrasolarPlanetsColors.theoreticalCurveColorProperty,
      lineWidth: 2,
    });
    model.showTheoreticalCurveProperty.link((visible) => fluxPlot.setVisible(visible));

    // ── Simulated measurements (scatter) ────────────────────────────────────────
    const measurementPlot = new ScatterPlot(chartTransform, [], {
      fill: ExtrasolarPlanetsColors.measurementColorProperty,
      radius: 2.5,
    });
    model.showSimulatedMeasurementsProperty.link((visible) => measurementPlot.setVisible(visible));
    model.measurementsProperty.link((points) => measurementPlot.setDataSet(points));

    // ── Phase indicator (vertical cursor at the current orbital phase) ─────────
    const phaseIndicator = new Line(0, 0, 0, CHART_VIEW_HEIGHT, {
      stroke: ExtrasolarPlanetsColors.phaseIndicatorColorProperty,
      lineWidth: 2,
    });
    const updatePhaseIndicator = (): void => {
      const viewX = chartTransform.modelToViewX(model.phaseProperty.value);
      phaseIndicator.setLine(viewX, 0, viewX, CHART_VIEW_HEIGHT);
    };
    model.phaseProperty.link(updatePhaseIndicator);
    chartTransform.changedEmitter.addListener(updatePhaseIndicator);

    // ── Layering: clip plots to the plotting area, keep labels outside ──────────
    const clippedLayer = new Node({
      clipArea: Shape.rect(0, 0, CHART_VIEW_WIDTH, CHART_VIEW_HEIGHT),
      children: [chartRectangle, xGrid, yGrid, baselineAxis, fluxPlot, measurementPlot, phaseIndicator],
    });
    const chartLayer = new Node({
      translation: new Vector2(CHART_LEFT_PADDING, CHART_TOP_PADDING),
      children: [clippedLayer, xTicks, yTicks, xLabels, yLabels],
    });

    // ── Title ──────────────────────────────────────────────────────────────────
    const title = new Text(chartStrings.titleStringProperty as TReadOnlyProperty<string>, {
      font: TITLE_FONT,
      fill: ExtrasolarPlanetsColors.textColorProperty,
    });
    title.centerX = CHART_LEFT_PADDING + CHART_VIEW_WIDTH / 2;
    title.top = 0;

    super({ children: [title, chartLayer] });

    // ── Live updates: redraw the curve + rescale the y-axis when physics changes
    const updateYAxis = (yRange: Range): void => {
      chartTransform.setModelYRange(yRange);
      const step = niceStep(yRange.max - yRange.min);
      const decimals = decimalPlacesForStep(step);
      yGrid.setSpacing(step);
      yTicks.setSpacing(step);
      yLabels.setSpacing(step);
      yLabels.setCreateLabel(
        (value) =>
          new Text(formatTickValue(value, decimals), {
            font: TICK_LABEL_FONT,
            fill: ExtrasolarPlanetsColors.textColorProperty,
          }),
      );
    };

    model.fluxCurveProperty.link((curve: Vector2[]) => {
      fluxPlot.setDataSet(curve);
      updateYAxis(computeCurveYRange(curve, FLAT_HALF_WINDOW_FLUX));
    });
  }
}
