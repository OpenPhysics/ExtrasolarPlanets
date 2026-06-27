/**
 * RadialVelocityScreenView.ts
 *
 * The top-level view for the Radial Velocity screen.
 *
 * Layout (within layoutBounds 1024×618):
 *   - chart (top-left)
 *   - orbit views (below the chart; toggles between a single 2-D orbit view and
 *     a 2×2 grid of side / earth / 2-D / 3-D perspectives)
 *   - control panel (top-right)
 *   - time control (play/pause/step, centered below the orbit views)
 *   - Reset All button (bottom-right)
 *
 * step(dt) forwards to the model so the orbital phase advances while playing,
 * driving the chart cursor and orbit views together.
 */

import { Node, Rectangle } from "scenerystack/scenery";
import { ResetAllButton, TimeControlNode } from "scenerystack/scenery-phet";
import type { ScreenViewOptions } from "scenerystack/sim";
import { ScreenView } from "scenerystack/sim";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import { SCREEN_VIEW_MARGIN } from "../../ExtrasolarPlanetsConstants.js";
import type { RadialVelocityModel } from "../model/RadialVelocityModel.js";
import { OrbitViewsNode } from "./OrbitViewsNode.js";
import { RadialVelocityChartNode } from "./RadialVelocityChartNode.js";
import { RadialVelocityControlPanel } from "./RadialVelocityControlPanel.js";
import { RadialVelocityScreenSummaryContent } from "./RadialVelocityScreenSummaryContent.js";

export class RadialVelocityScreenView extends ScreenView {
  private readonly model: RadialVelocityModel;

  public constructor(model: RadialVelocityModel, options?: ScreenViewOptions) {
    // ── Accessibility: screen summary ───────────────────────────────────────────
    super({
      screenSummaryContent: new RadialVelocityScreenSummaryContent(model),
      ...options,
    });

    this.model = model;

    // ── Background ────────────────────────────────────────────────────────────
    const backgroundRect = new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
      fill: ExtrasolarPlanetsColors.backgroundColorProperty,
    });
    this.addChild(backgroundRect);

    // ── Chart ───────────────────────────────────────────────────────────────────
    const chartNode = new RadialVelocityChartNode(model);
    chartNode.left = SCREEN_VIEW_MARGIN;
    chartNode.top = SCREEN_VIEW_MARGIN;
    this.addChild(chartNode);

    // ── Orbit views (below the chart) ───────────────────────────────────────────
    const vizTop = chartNode.bottom + SCREEN_VIEW_MARGIN;
    // Reserve a strip at the bottom for the time control + Reset All.
    const timeControlStripHeight = 70;
    const vizBottom = this.layoutBounds.maxY - SCREEN_VIEW_MARGIN - timeControlStripHeight;
    const orbitViewsWidth = chartNode.width;
    const orbitViewsHeight = Math.max(120, vizBottom - vizTop);
    const orbitViews = new OrbitViewsNode(model, orbitViewsWidth, orbitViewsHeight);
    orbitViews.left = SCREEN_VIEW_MARGIN;
    orbitViews.top = vizTop;
    this.addChild(orbitViews);

    // ── Control panel ───────────────────────────────────────────────────────────
    const controlPanel = new RadialVelocityControlPanel(model);
    const availableHeight = this.layoutBounds.height - 2 * SCREEN_VIEW_MARGIN;
    if (controlPanel.height > availableHeight) {
      controlPanel.setScaleMagnitude(availableHeight / controlPanel.height);
    }
    controlPanel.top = SCREEN_VIEW_MARGIN;
    controlPanel.right = this.layoutBounds.maxX - SCREEN_VIEW_MARGIN;
    this.addChild(controlPanel);

    // ── Time control (play/pause/step) ──────────────────────────────────────────
    const timeControlNode = new TimeControlNode(model.timer.isPlayingProperty, {
      tandem: this.tandem.createTandem("timeControlNode"),
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.step(1 / 60),
        },
      },
    });
    timeControlNode.centerX = orbitViews.left + orbitViewsWidth / 2;
    timeControlNode.bottom = this.layoutBounds.maxY - SCREEN_VIEW_MARGIN;
    this.addChild(timeControlNode);

    // ── Reset All button ──────────────────────────────────────────────────────
    const resetAllButton = new ResetAllButton({
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - SCREEN_VIEW_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VIEW_MARGIN,
    });
    this.addChild(resetAllButton);

    // ── Accessibility: keyboard / reading traversal order ───────────────────────
    this.addChild(
      new Node({
        pdomOrder: [...controlPanel.controlsInOrder, timeControlNode, resetAllButton],
      }),
    );
  }

  public reset(): void {
    // No view-side mutable state to reset yet (orbit views listen to the model).
  }

  public override step(dt: number): void {
    this.model.step(dt);
  }
}
