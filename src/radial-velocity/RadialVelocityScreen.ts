/**
 * RadialVelocityScreen.ts
 *
 * The top-level Screen component for the Radial Velocity screen. It wires
 * together the model and view factories and passes screen-level options (name,
 * background color, tandem) to the parent Screen class.
 */
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { ScreenOptions } from "scenerystack/sim";
import { Screen } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import ExtrasolarPlanetsColors from "../ExtrasolarPlanetsColors.js";
import { RadialVelocityModel } from "./model/RadialVelocityModel.js";
import { RadialVelocityKeyboardHelpContent } from "./view/RadialVelocityKeyboardHelpContent.js";
import { RadialVelocityScreenView } from "./view/RadialVelocityScreenView.js";

// Require tandem to be explicit — accidental omission would break PhET-iO.
type RadialVelocityScreenOptions = ScreenOptions & { tandem: Tandem };

export class RadialVelocityScreen extends Screen<RadialVelocityModel, RadialVelocityScreenView> {
  public constructor(options: RadialVelocityScreenOptions) {
    super(
      // Model factory — called once when the screen is first shown
      () => new RadialVelocityModel(),
      // View factory — receives the model instance
      (model) =>
        new RadialVelocityScreenView(model, {
          tandem: options.tandem.createTandem("view"),
        }),
      optionize<RadialVelocityScreenOptions, EmptySelfOptions, ScreenOptions>()(
        {
          backgroundColorProperty: ExtrasolarPlanetsColors.backgroundColorProperty,
          createKeyboardHelpNode: () => new RadialVelocityKeyboardHelpContent(),
        },
        options,
      ),
    );
  }
}
