/**
 * RadialVelocityScreenView.ts
 *
 * The top-level view for the Radial Velocity screen.
 *
 * All visual nodes are added here. Follow these conventions:
 *   - Use this.layoutBounds for positioning (never magic pixel values)
 *   - Keep a ResetAllButton that calls model.reset() and this.reset()
 *   - Override step(dt) for frame-by-frame animation
 */

import { Node, Rectangle, Text } from "scenerystack/scenery";
import { ResetAllButton } from "scenerystack/scenery-phet";
import type { ScreenViewOptions } from "scenerystack/sim";
import { ScreenView } from "scenerystack/sim";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import { SCREEN_VIEW_MARGIN } from "../../ExtrasolarPlanetsConstants.js";
import type { RadialVelocityModel } from "../model/RadialVelocityModel.js";
import { RadialVelocityScreenSummaryContent } from "./RadialVelocityScreenSummaryContent.js";

export class RadialVelocityScreenView extends ScreenView {
  public constructor(model: RadialVelocityModel, options?: ScreenViewOptions) {
    // ── Accessibility: screen summary ───────────────────────────────────────────
    // The screen summary is the first thing a screen-reader user encounters. It
    // is registered here, in the ScreenView's super() options, so every screen
    // wires it the same way.
    super({
      screenSummaryContent: new RadialVelocityScreenSummaryContent(model),
      ...options,
    });

    // ── Background ────────────────────────────────────────────────────────────
    // A full-screen rectangle that follows the active color profile.
    // Replace or remove once you add real content.
    const backgroundRect = new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
      fill: ExtrasolarPlanetsColors.backgroundColorProperty,
    });
    this.addChild(backgroundRect);

    // ── Placeholder label ─────────────────────────────────────────────────────
    // Replace this with the screen's actual simulation content.
    const placeholderText = new Text("Radial Velocity", {
      font: "bold 36px sans-serif",
      fill: ExtrasolarPlanetsColors.textColorProperty,
      center: this.layoutBounds.center,
    });
    this.addChild(placeholderText);

    // ── Accessibility: per-control names ────────────────────────────────────────
    // EVERY interactive node must carry an `accessibleName` (and an
    // `accessibleHelpText` where useful), sourced from the StringManager `a11y`
    // string group — never a hard-coded English literal. Read it through
    // `StringManager.getInstance().getRadialVelocityA11yStrings()`.

    // ── Reset All button ──────────────────────────────────────────────────────
    // Always position at bottom-right (PhET convention).
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
    // Make the parallel DOM (Tab order and screen-reader reading order)
    // deterministic and independent of child z-order. ScreenView throws if you
    // set pdomOrder on itself, so add a lightweight wrapper Node that "borrows"
    // the interactive nodes in the order a user should reach them — Reset All
    // last. Non-interactive decoration (background, placeholder) is omitted.
    this.addChild(
      new Node({
        pdomOrder: [
          // TODO: add the screen's interactive nodes here, in traversal order
          resetAllButton,
        ],
      }),
    );
  }

  /**
   * Resets view-side state (animations, panel visibility, etc.).
   * Called by the Reset All button listener.
   */
  public reset(): void {
    // TODO: reset any view-side state here
  }

  /**
   * Steps the view forward by dt seconds for animation.
   * @param _dt - elapsed time in seconds
   */
  public override step(_dt: number): void {
    // TODO: implement animation updates here
  }
}
