/**
 * ExtrasolarPlanetsPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Controls are bound
 * to ExtrasolarPlanetsPreferencesModel Properties (whose initial values come from
 * extrasolarPlanetsQueryParameters).
 */

import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Checkbox } from "scenerystack/sun";
import type { Tandem } from "scenerystack/tandem";
import ExtrasolarPlanetsColors from "../ExtrasolarPlanetsColors.js";
import ExtrasolarPlanetsNamespace from "../ExtrasolarPlanetsNamespace.js";
import { StringManager } from "../i18n/StringManager.js";
import type { ExtrasolarPlanetsPreferencesModel } from "./ExtrasolarPlanetsPreferencesModel.js";

export class ExtrasolarPlanetsPreferencesNode extends VBox {
  public constructor(preferencesModel: ExtrasolarPlanetsPreferencesModel, tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: 18, weight: "bold" }),
      fill: ExtrasolarPlanetsColors.textColorProperty,
    });

    const exampleToggleCheckbox = new Checkbox(
      preferencesModel.exampleToggleProperty,
      new Text(prefStrings.exampleToggleStringProperty, {
        font: new PhetFont(14),
        fill: ExtrasolarPlanetsColors.textColorProperty,
      }),
      {
        checkboxColor: ExtrasolarPlanetsColors.textColorProperty,
        checkboxColorBackground: ExtrasolarPlanetsColors.panelBackgroundColorProperty,
        spacing: 8,
        ...(tandem && { tandem: tandem.createTandem("exampleToggleCheckbox") }),
      },
    );

    super({
      align: "left",
      spacing: 12,
      children: [header, exampleToggleCheckbox],
    });
  }
}

ExtrasolarPlanetsNamespace.register("ExtrasolarPlanetsPreferencesNode", ExtrasolarPlanetsPreferencesNode);
