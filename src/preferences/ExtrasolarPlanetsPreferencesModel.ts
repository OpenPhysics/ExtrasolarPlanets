/**
 * ExtrasolarPlanetsPreferencesModel.ts
 *
 * Model for the simulation-specific preferences shown in Preferences →
 * Simulation. Each preference Property takes its initial value from the
 * corresponding query parameter in extrasolarPlanetsQueryParameters.
 *
 * Remove the example preference (and its query parameter / UI control) if the
 * sim has no sim-specific preferences.
 */

import { BooleanProperty } from "scenerystack/axon";
import type { Tandem } from "scenerystack/tandem";
import ExtrasolarPlanetsNamespace from "../ExtrasolarPlanetsNamespace.js";
import extrasolarPlanetsQueryParameters from "./extrasolarPlanetsQueryParameters.js";

export class ExtrasolarPlanetsPreferencesModel {
  /** Example preference; initial value comes from the `exampleToggle` query parameter. */
  public readonly exampleToggleProperty: BooleanProperty;

  public constructor(tandem?: Tandem) {
    this.exampleToggleProperty = new BooleanProperty(
      extrasolarPlanetsQueryParameters.exampleToggle,
      tandem ? { tandem: tandem.createTandem("exampleToggleProperty") } : undefined,
    );
  }

  public reset(): void {
    this.exampleToggleProperty.reset();
  }
}

ExtrasolarPlanetsNamespace.register("ExtrasolarPlanetsPreferencesModel", ExtrasolarPlanetsPreferencesModel);
