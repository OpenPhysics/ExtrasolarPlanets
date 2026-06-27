/**
 * RadialVelocityControlPanel.ts
 *
 * The Radial Velocity screen's control panel: orbital + measurement sliders,
 * the three view-toggle checkboxes, the derived star-property readout, and the
 * system-period / amplitude readouts. Charts, the preset combo box, and the
 * time control arrive in later milestones.
 */

import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { type Node, RichText, VBox } from "scenerystack/scenery";
import { Checkbox } from "scenerystack/sun";
import { ExtrasolarPlanetsPanel } from "../../common/ExtrasolarPlanetsPanel.js";
import { createNumberControl } from "../../common/view/createNumberControl.js";
import { StarPropertiesNode } from "../../common/view/StarPropertiesNode.js";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import {
  RV_ANIMATION_SPEED_RANGE,
  RV_ECCENTRICITY_RANGE,
  RV_INCLINATION_RANGE,
  RV_LONGITUDE_RANGE,
  RV_NOISE_RANGE,
  RV_NUMBER_OF_MEASUREMENTS_RANGE,
  RV_PLANET_MASS_RANGE,
  RV_SEMIMAJOR_AXIS_RANGE,
  RV_STAR_MASS_RANGE,
} from "../../ExtrasolarPlanetsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { RadialVelocityModel } from "../model/RadialVelocityModel.js";

/** Three significant figures, integerized where possible (e.g. 365.07 → "365"). */
function format3(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return String(Number(value.toPrecision(3)));
}

export class RadialVelocityControlPanel extends ExtrasolarPlanetsPanel {
  /** The interactive nodes, in tab order, for the ScreenView's pdomOrder. */
  public readonly controlsInOrder: Node[];

  public constructor(model: RadialVelocityModel) {
    const strings = StringManager.getInstance().getRadialVelocityStrings();
    const units = StringManager.getInstance().getUnits();
    const controls = strings.controls;

    const planetMassControl = createNumberControl(
      controls.planetMassStringProperty,
      model.planetMassProperty,
      RV_PLANET_MASS_RANGE,
      { unitsProperty: units.mJupiterStringProperty, decimalPlaces: 3, delta: 0.001 },
    );
    const semimajorAxisControl = createNumberControl(
      controls.semimajorAxisStringProperty,
      model.semimajorAxisProperty,
      RV_SEMIMAJOR_AXIS_RANGE,
      { unitsProperty: units.auStringProperty, decimalPlaces: 2, delta: 0.01 },
    );
    const eccentricityControl = createNumberControl(
      controls.eccentricityStringProperty,
      model.eccentricityProperty,
      RV_ECCENTRICITY_RANGE,
      { decimalPlaces: 2, delta: 0.01 },
    );
    const starMassControl = createNumberControl(
      controls.starMassStringProperty,
      model.starMassProperty,
      RV_STAR_MASS_RANGE,
      { unitsProperty: units.mSunStringProperty, decimalPlaces: 2, delta: 0.01 },
    );
    const inclinationControl = createNumberControl(
      controls.inclinationStringProperty,
      model.inclinationProperty,
      RV_INCLINATION_RANGE,
      { unitsProperty: units.degreesStringProperty, decimalPlaces: 1, delta: 0.5 },
    );
    const longitudeControl = createNumberControl(
      controls.longitudeStringProperty,
      model.longitudeProperty,
      RV_LONGITUDE_RANGE,
      { unitsProperty: units.degreesStringProperty, decimalPlaces: 0, delta: 1 },
    );
    const noiseControl = createNumberControl(controls.noiseStringProperty, model.noiseProperty, RV_NOISE_RANGE, {
      unitsProperty: units.metersPerSecondStringProperty,
      decimalPlaces: 0,
      delta: 1,
    });
    const numberControl = createNumberControl(
      controls.numberOfMeasurementsStringProperty,
      model.numberOfMeasurementsProperty,
      RV_NUMBER_OF_MEASUREMENTS_RANGE,
      { decimalPlaces: 0, delta: 1 },
    );
    const animationSpeedControl = createNumberControl(
      controls.animationSpeedStringProperty,
      model.animationSpeedProperty,
      RV_ANIMATION_SPEED_RANGE,
      { decimalPlaces: 5, delta: 0.00005 },
    );

    const makeCheckbox = (
      property: typeof model.showTheoreticalCurveProperty,
      labelProperty: typeof controls.planetMassStringProperty,
    ): Checkbox =>
      new Checkbox(
        property,
        new RichText(labelProperty, { fill: ExtrasolarPlanetsColors.textColorProperty, font: "13px sans-serif" }),
        {
          accessibleName: labelProperty,
          checkboxColor: ExtrasolarPlanetsColors.textColorProperty,
          checkboxColorBackground: ExtrasolarPlanetsColors.panelBackgroundColorProperty,
        },
      );

    const showCurveCheckbox = makeCheckbox(
      model.showTheoreticalCurveProperty,
      controls.showTheoreticalCurveStringProperty,
    );
    const showMeasurementsCheckbox = makeCheckbox(
      model.showSimulatedMeasurementsProperty,
      controls.showSimulatedMeasurementsStringProperty,
    );
    const showViewsCheckbox = makeCheckbox(model.showMultipleViewsProperty, controls.showMultipleViewsStringProperty);

    // ── Readouts ────────────────────────────────────────────────────────────────
    const starPropertiesNode = new StarPropertiesNode(
      model.starPropertiesProperty,
      strings.readouts.starTypePatternStringProperty,
    );
    const periodReadout = new RichText(
      new PatternStringProperty(strings.readouts.systemPeriodPatternStringProperty, {
        value: new DerivedProperty([model.periodDaysProperty], format3),
      }),
      { fill: ExtrasolarPlanetsColors.textColorProperty, font: "13px sans-serif", maxWidth: 260 },
    );
    const amplitudeReadout = new RichText(
      new PatternStringProperty(strings.readouts.amplitudePatternStringProperty, {
        value: new DerivedProperty([model.amplitudeProperty], format3),
      }),
      { fill: ExtrasolarPlanetsColors.textColorProperty, font: "13px sans-serif", maxWidth: 260 },
    );

    const content = new VBox({
      align: "left",
      spacing: 8,
      children: [
        planetMassControl,
        semimajorAxisControl,
        eccentricityControl,
        starMassControl,
        inclinationControl,
        longitudeControl,
        noiseControl,
        numberControl,
        animationSpeedControl,
        showCurveCheckbox,
        showMeasurementsCheckbox,
        showViewsCheckbox,
        starPropertiesNode,
        periodReadout,
        amplitudeReadout,
      ],
    });

    super(content);

    this.controlsInOrder = [
      planetMassControl,
      semimajorAxisControl,
      eccentricityControl,
      starMassControl,
      inclinationControl,
      longitudeControl,
      noiseControl,
      numberControl,
      animationSpeedControl,
      showCurveCheckbox,
      showMeasurementsCheckbox,
      showViewsCheckbox,
    ];
  }
}
