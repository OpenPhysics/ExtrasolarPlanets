/**
 * TransitScreenView.ts
 *
 * The top-level view for the Transit screen.
 *
 * Layout (within layoutBounds 1024×618):
 *   - chart (top-left)
 *   - transit visualization (below the chart; the star disk + transiting planet)
 *   - control panel (top-right)
 *   - time control (play/pause/step, centered below the visualization)
 *   - Reset All button (bottom-right)
 *
 * step(dt) forwards to the model so the orbital phase advances while playing,
 * driving the chart cursor and the planet across the star together.
 */

import { Node, Rectangle } from "scenerystack/scenery";
import { ResetAllButton, TimeControlNode } from "scenerystack/scenery-phet";
import type { ScreenViewOptions } from "scenerystack/sim";
import { ScreenView } from "scenerystack/sim";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import { SCREEN_VIEW_MARGIN } from "../../ExtrasolarPlanetsConstants.js";
import type { TransitModel } from "../model/TransitModel.js";
import { TransitChartNode } from "./TransitChartNode.js";
import { TransitControlPanel } from "./TransitControlPanel.js";
import { TransitScreenSummaryContent } from "./TransitScreenSummaryContent.js";
import { TransitVisualizationNode } from "./TransitVisualizationNode.js";

export class TransitScreenView extends ScreenView {
  private readonly model: TransitModel;

  public constructor(model: TransitModel, options?: ScreenViewOptions) {
    super({
      screenSummaryContent: new TransitScreenSummaryContent(model),
      ...options,
    });

    this.model = model;

    // ── Background ────────────────────────────────────────────────────────────
    const backgroundRect = new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
      fill: ExtrasolarPlanetsColors.backgroundColorProperty,
    });
    this.addChild(backgroundRect);

    // ── Chart ───────────────────────────────────────────────────────────────────
    const chartNode = new TransitChartNode(model);
    chartNode.left = SCREEN_VIEW_MARGIN;
    chartNode.top = SCREEN_VIEW_MARGIN;
    this.addChild(chartNode);

    // ── Transit visualization (below the chart) ─────────────────────────────────
    const vizTop = chartNode.bottom + SCREEN_VIEW_MARGIN;
    const timeControlStripHeight = 70;
    const vizBottom = this.layoutBounds.maxY - SCREEN_VIEW_MARGIN - timeControlStripHeight;
    const vizSize = Math.max(120, Math.min(chartNode.width, vizBottom - vizTop));
    const transitViz = new TransitVisualizationNode(model, vizSize);
    transitViz.left = SCREEN_VIEW_MARGIN;
    transitViz.top = vizTop;
    this.addChild(transitViz);

    // ── Control panel ───────────────────────────────────────────────────────────
    const controlPanel = new TransitControlPanel(model);
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
    timeControlNode.centerX = transitViz.left + vizSize / 2;
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
    // No view-side mutable state to reset yet (the visualization listens to the model).
  }

  public override step(dt: number): void {
    this.model.step(dt);
  }
}
