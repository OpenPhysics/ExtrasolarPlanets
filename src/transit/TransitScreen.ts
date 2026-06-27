/**
 * TransitScreen.ts
 *
 * The top-level Screen component for the Transit screen. It wires together the
 * model and view factories and passes screen-level options (name, background
 * color, tandem) to the parent Screen class.
 */
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { ScreenOptions } from "scenerystack/sim";
import { Screen } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import ExtrasolarPlanetsColors from "../ExtrasolarPlanetsColors.js";
import { TransitModel } from "./model/TransitModel.js";
import { TransitKeyboardHelpContent } from "./view/TransitKeyboardHelpContent.js";
import { TransitScreenView } from "./view/TransitScreenView.js";

// Require tandem to be explicit — accidental omission would break PhET-iO.
type TransitScreenOptions = ScreenOptions & { tandem: Tandem };

export class TransitScreen extends Screen<TransitModel, TransitScreenView> {
  public constructor(options: TransitScreenOptions) {
    super(
      // Model factory — called once when the screen is first shown
      () => new TransitModel(),
      // View factory — receives the model instance
      (model) =>
        new TransitScreenView(model, {
          tandem: options.tandem.createTandem("view"),
        }),
      optionize<TransitScreenOptions, EmptySelfOptions, ScreenOptions>()(
        {
          backgroundColorProperty: ExtrasolarPlanetsColors.backgroundColorProperty,
          createKeyboardHelpNode: () => new TransitKeyboardHelpContent(),
        },
        options,
      ),
    );
  }
}
