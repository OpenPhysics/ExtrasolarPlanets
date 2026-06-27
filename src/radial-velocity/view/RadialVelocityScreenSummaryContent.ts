/**
 * RadialVelocityScreenSummaryContent.ts
 *
 * The accessible screen summary read by screen readers (SceneryStack's
 * Interactive Description). It appears at the top of the parallel DOM and gives
 * a non-visual user a way to orient themselves and to re-read the screen's
 * current state at any time.
 *
 * A summary has four regions:
 *   - playAreaContent       — what the play area contains
 *   - controlAreaContent    — what the controls do
 *   - currentDetailsContent — a LIVE paragraph describing current state
 *   - interactionHintContent — a short hint on how to get started
 *
 * ── Making "current details" live ─────────────────────────────────────────────
 * This scaffold has no model state, so currentDetails is a static string. In a
 * real sim, build a PatternStringProperty/DerivedProperty over the relevant
 * model Properties and pass it as `currentDetailsContent` so the paragraph
 * updates as the sim runs.
 */
import { ScreenSummaryContent } from "scenerystack/sim";
import { StringManager } from "../../i18n/StringManager.js";
import type { RadialVelocityModel } from "../model/RadialVelocityModel.js";

export class RadialVelocityScreenSummaryContent extends ScreenSummaryContent {
  // `model` is unused in the scaffold but kept in the signature so real sims can
  // derive a live currentDetailsContent from it without changing call sites.
  public constructor(_model: RadialVelocityModel) {
    const a11y = StringManager.getInstance().getRadialVelocityA11yStrings();

    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: a11y.currentDetailsStringProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
    });
  }
}
