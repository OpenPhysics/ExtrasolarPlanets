/**
 * createNumberControl.ts
 *
 * Factory for a themed `NumberControl` used by both screens' control panels.
 * It standardizes:
 *  - title + value text in the sim's text colour,
 *  - an optional unit suffix rendered via `numberDisplayOptions.valuePattern`
 *    (units come from a localized StringProperty, never an English literal),
 *  - an `accessibleName` (defaults to the title) so every slider is reachable.
 *
 * Units use the `{{value}}` placeholder convention that `NumberDisplay` fills in,
 * and rich text so subscripted unit labels (e.g. M<sub>Jup</sub>) render.
 */

import type { PhetioProperty } from "scenerystack/axon";
import { DerivedProperty, type TReadOnlyProperty } from "scenerystack/axon";
import type { Range } from "scenerystack/dot";
import { NumberControl, type NumberControlOptions } from "scenerystack/scenery-phet";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import { FLAT_ARROW_BUTTON_OPTIONS } from "../ExtrasolarPlanetsButtonOptions.js";

export type CreateNumberControlOptions = {
  /** Localized unit suffix appended after the value (e.g. "AU", "m/s"). */
  unitsProperty?: TReadOnlyProperty<string>;
  /** Digits shown after the decimal point in the readout (default 0). */
  decimalPlaces?: number;
  /** Arrow-button / keyboard step (default: 1/100 of the range). */
  delta?: number;
  /** Accessible name; defaults to the visible title. */
  accessibleName?: TReadOnlyProperty<string>;
  /** Extra NumberControl options merged last. */
  numberControlOptions?: NumberControlOptions;
};

export function createNumberControl(
  titleProperty: TReadOnlyProperty<string>,
  numberProperty: PhetioProperty<number>,
  range: Range,
  providedOptions?: CreateNumberControlOptions,
): NumberControl {
  const options = providedOptions ?? {};
  const decimalPlaces = options.decimalPlaces ?? 0;
  const delta = options.delta ?? (range.max - range.min) / 100;

  // Build "<value> <units>" lazily so the unit label stays localized.
  const valuePattern = options.unitsProperty
    ? new DerivedProperty([options.unitsProperty], (units) => `{{value}} ${units}`)
    : undefined;

  return new NumberControl(titleProperty, numberProperty, range, {
    delta,
    accessibleName: options.accessibleName ?? titleProperty,
    titleNodeOptions: {
      fill: ExtrasolarPlanetsColors.textColorProperty,
      maxWidth: 160,
    },
    numberDisplayOptions: {
      decimalPlaces,
      useRichText: true,
      textOptions: {
        fill: ExtrasolarPlanetsColors.textColorProperty,
      },
      ...(valuePattern ? { valuePattern } : {}),
    },
    ...FLAT_ARROW_BUTTON_OPTIONS,
    ...options.numberControlOptions,
  });
}
