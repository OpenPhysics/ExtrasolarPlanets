/**
 * ExtrasolarPlanetsScreenIcons.ts
 *
 * Programmatic home-screen / navigation-bar icons for both Extrasolar Planets
 * screens. Drawn from scenery primitives on the standard PhET 548 × 373 icon
 * canvas; colors come from ExtrasolarPlanetsColors so they follow the active
 * (default / projector) color profile.
 *
 *   Radial Velocity — star + orbiting planet with a sinusoidal RV curve below.
 *   Transit         — star with a crossing planet and a dipped light curve.
 */
import { Shape } from "scenerystack/kite";
import { Circle, Line, Node, Path, Rectangle } from "scenerystack/scenery";
import { ScreenIcon } from "scenerystack/sim";
import ExtrasolarPlanetsColors from "../ExtrasolarPlanetsColors.js";

const W = 548;
const H = 373;
const CX = W / 2;

function background(fill = ExtrasolarPlanetsColors.skyBackgroundColorProperty): Rectangle {
  return new Rectangle(0, 0, W, H, { fill });
}

function iconFrom(content: Node, fill = ExtrasolarPlanetsColors.skyBackgroundColorProperty): ScreenIcon {
  return new ScreenIcon(content, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1,
    fill,
  });
}

/** Sample a y = amp * sin(phase + k·x) polyline. */
function sinePath(x0: number, x1: number, y0: number, amp: number, cycles: number, phase: number, samples = 48): Shape {
  const shape = new Shape();
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = x0 + t * (x1 - x0);
    const y = y0 + amp * Math.sin(phase + t * cycles * Math.PI * 2);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return shape;
}

function chartFrame(x: number, y: number, w: number, h: number): Node {
  return new Node({
    children: [
      new Rectangle(x, y, w, h, 6, 6, {
        fill: ExtrasolarPlanetsColors.chartBackgroundColorProperty,
        stroke: ExtrasolarPlanetsColors.panelBorderColorProperty,
        lineWidth: 2,
      }),
      new Line(x + 18, y + 12, x + 18, y + h - 12, {
        stroke: ExtrasolarPlanetsColors.chartGridColorProperty,
        lineWidth: 2,
      }),
      new Line(x + 18, y + h / 2, x + w - 14, y + h / 2, {
        stroke: ExtrasolarPlanetsColors.chartGridColorProperty,
        lineWidth: 2,
      }),
    ],
  });
}

/** Radial Velocity: orbiting planet + RV sine curve. */
export function createRadialVelocityIcon(): ScreenIcon {
  const star = new Circle(42, {
    fill: ExtrasolarPlanetsColors.starColorProperty,
    centerX: CX - 40,
    centerY: 120,
  });
  const orbit = new Path(Shape.ellipse(CX - 40, 120, 110, 48, 0), {
    stroke: ExtrasolarPlanetsColors.orbitPathColorProperty,
    lineWidth: 3,
  });
  const planet = new Circle(16, {
    fill: ExtrasolarPlanetsColors.planetColorProperty,
    centerX: CX + 55,
    centerY: 105,
  });
  const los = new Line(CX - 40, 120, CX - 40, 40, {
    stroke: ExtrasolarPlanetsColors.lineOfSightColorProperty,
    lineWidth: 4,
    lineCap: "round",
  });

  const chartX = 70;
  const chartY = 210;
  const chartW = W - 140;
  const chartH = 120;
  const curve = new Path(sinePath(chartX + 28, chartX + chartW - 18, chartY + chartH / 2, 32, 1.5, 0.4), {
    stroke: ExtrasolarPlanetsColors.theoreticalCurveColorProperty,
    lineWidth: 5,
    lineCap: "round",
    lineJoin: "round",
  });
  const phase = new Line(chartX + chartW * 0.62, chartY + 16, chartX + chartW * 0.62, chartY + chartH - 16, {
    stroke: ExtrasolarPlanetsColors.phaseIndicatorColorProperty,
    lineWidth: 3,
  });

  return iconFrom(
    new Node({
      children: [background(), star, orbit, planet, los, chartFrame(chartX, chartY, chartW, chartH), curve, phase],
    }),
  );
}

/** Transit: star with crossing planet + light-curve dip. */
export function createTransitIcon(): ScreenIcon {
  const star = new Circle(70, {
    fill: ExtrasolarPlanetsColors.starColorProperty,
    centerX: CX,
    centerY: 130,
  });
  const planet = new Circle(22, {
    fill: ExtrasolarPlanetsColors.planetColorProperty,
    centerX: CX + 18,
    centerY: 118,
  });
  const path = new Path(Shape.ellipse(CX, 130, 150, 36, 0), {
    stroke: ExtrasolarPlanetsColors.orbitPathColorProperty,
    lineWidth: 3,
    lineDash: [10, 8],
  });

  const chartX = 70;
  const chartY = 230;
  const chartW = W - 140;
  const chartH = 100;
  const baselineY = chartY + 28;
  const dipDepth = 42;
  const dipShape = new Shape()
    .moveTo(chartX + 24, baselineY)
    .lineTo(chartX + chartW * 0.32, baselineY)
    .lineTo(chartX + chartW * 0.4, baselineY + dipDepth)
    .lineTo(chartX + chartW * 0.6, baselineY + dipDepth)
    .lineTo(chartX + chartW * 0.68, baselineY)
    .lineTo(chartX + chartW - 20, baselineY);
  const lightCurve = new Path(dipShape, {
    stroke: ExtrasolarPlanetsColors.theoreticalCurveColorProperty,
    lineWidth: 5,
    lineCap: "round",
    lineJoin: "round",
  });
  const duration = new Line(chartX + chartW * 0.4, chartY + chartH - 18, chartX + chartW * 0.6, chartY + chartH - 18, {
    stroke: ExtrasolarPlanetsColors.durationArrowColorProperty,
    lineWidth: 5,
    lineCap: "round",
  });

  return iconFrom(
    new Node({
      children: [background(), path, star, planet, chartFrame(chartX, chartY, chartW, chartH), lightCurve, duration],
    }),
  );
}
