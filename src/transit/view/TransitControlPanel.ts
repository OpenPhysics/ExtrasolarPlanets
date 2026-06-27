/**
 * TransitControlPanel.ts
 *
 * The Transit screen's control panel: planet + orbital + measurement sliders,
 * the two view-toggle checkboxes, the derived star-property readout, and the
 * system-period / eclipse-depth / eclipse-duration readouts. The light-curve
 * chart, transit visualization, preset combo box, and time control arrive in
 * later milestones.
 */

import { DerivedProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { type Node, RichText, VBox } from "scenerystack/scenery";
import { Checkbox } from "scenerystack/sun";
import { ExtrasolarPlanetsPanel } from "../../common/ExtrasolarPlanetsPanel.js";
import { createNumberControl } from "../../common/view/createNumberControl.js";
import { StarPropertiesNode } from "../../common/view/StarPropertiesNode.js";
import ExtrasolarPlanetsColors from "../../ExtrasolarPlanetsColors.js";
import {
  TRANSIT_ANIMATION_SPEED_RANGE,
  TRANSIT_ECCENTRICITY_RANGE,
  TRANSIT_INCLINATION_RANGE,
  TRANSIT_LONGITUDE_RANGE,
  TRANSIT_NOISE_RANGE,
  TRANSIT_NUMBER_OF_MEASUREMENTS_RANGE,
  TRANSIT_PLANET_MASS_RANGE,
  TRANSIT_PLANET_RADIUS_RANGE,
  TRANSIT_SEMIMAJOR_AXIS_RANGE,
  TRANSIT_STAR_MASS_RANGE,
} from "../../ExtrasolarPlanetsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { TransitModel } from "../model/TransitModel.js";

/** Three significant figures, integerized where possible (e.g. 3.469 → "3.47"). */
function format3(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return String(Number(value.toPrecision(3)));
}

export class TransitControlPanel extends ExtrasolarPlanetsPanel {
  /** The interactive nodes, in tab order, for the ScreenView's pdomOrder. */
  public readonly controlsInOrder: Node[];

  public constructor(model: TransitModel) {
    const strings = StringManager.getInstance().getTransitStrings();
    const units = StringManager.getInstance().getUnits();
    const controls = strings.controls;

    const planetMassControl = createNumberControl(
      controls.planetMassStringProperty,
      model.planetMassProperty,
      TRANSIT_PLANET_MASS_RANGE,
      { unitsProperty: units.mJupiterStringProperty, decimalPlaces: 3, delta: 0.001 },
    );
    const planetRadiusControl = createNumberControl(
      controls.planetRadiusStringProperty,
      model.planetRadiusProperty,
      TRANSIT_PLANET_RADIUS_RANGE,
      { unitsProperty: units.rJupiterStringProperty, decimalPlaces: 2, delta: 0.01 },
    );
    const starMassControl = createNumberControl(
      controls.starMassStringProperty,
      model.starMassProperty,
      TRANSIT_STAR_MASS_RANGE,
      { unitsProperty: units.mSunStringProperty, decimalPlaces: 2, delta: 0.01 },
    );
    const semimajorAxisControl = createNumberControl(
      controls.semimajorAxisStringProperty,
      model.semimajorAxisProperty,
      TRANSIT_SEMIMAJOR_AXIS_RANGE,
      { unitsProperty: units.auStringProperty, decimalPlaces: 3, delta: 0.001 },
    );
    const eccentricityControl = createNumberControl(
      controls.eccentricityStringProperty,
      model.eccentricityProperty,
      TRANSIT_ECCENTRICITY_RANGE,
      { decimalPlaces: 3, delta: 0.005 },
    );
    const inclinationControl = createNumberControl(
      controls.inclinationStringProperty,
      model.inclinationProperty,
      TRANSIT_INCLINATION_RANGE,
      { unitsProperty: units.degreesStringProperty, decimalPlaces: 1, delta: 0.1 },
    );
    const longitudeControl = createNumberControl(
      controls.longitudeStringProperty,
      model.longitudeProperty,
      TRANSIT_LONGITUDE_RANGE,
      { unitsProperty: units.degreesStringProperty, decimalPlaces: 0, delta: 1 },
    );
    const noiseControl = createNumberControl(controls.noiseStringProperty, model.noiseProperty, TRANSIT_NOISE_RANGE, {
      decimalPlaces: 3,
      delta: 0.001,
    });
    const numberControl = createNumberControl(
      controls.numberOfMeasurementsStringProperty,
      model.numberOfMeasurementsProperty,
      TRANSIT_NUMBER_OF_MEASUREMENTS_RANGE,
      { decimalPlaces: 0, delta: 1 },
    );
    const animationSpeedControl = createNumberControl(
      controls.animationSpeedStringProperty,
      model.animationSpeedProperty,
      TRANSIT_ANIMATION_SPEED_RANGE,
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

    // ── Readouts ────────────────────────────────────────────────────────────────
    const starPropertiesNode = new StarPropertiesNode(
      model.starPropertiesProperty,
      strings.readouts.starTypePatternStringProperty,
    );
    const readoutText = (stringProperty: TReadOnlyProperty<string>): RichText =>
      new RichText(stringProperty, {
        fill: ExtrasolarPlanetsColors.textColorProperty,
        font: "13px sans-serif",
        maxWidth: 260,
      });

    const periodReadout = readoutText(
      new PatternStringProperty(strings.readouts.systemPeriodPatternStringProperty, {
        value: new DerivedProperty([model.systemPeriodDaysProperty], format3),
      }),
    );
    const eclipseDepthReadout = readoutText(
      new PatternStringProperty(strings.readouts.eclipseDepthPatternStringProperty, {
        value: new DerivedProperty([model.eclipseDepthProperty], (depth) => (depth > 0 ? format3(depth) : "—")),
      }),
    );
    const eclipseDurationReadout = readoutText(
      new PatternStringProperty(strings.readouts.eclipseDurationPatternStringProperty, {
        value: new DerivedProperty([model.eclipseDurationHoursProperty], (hours) => (hours > 0 ? format3(hours) : "—")),
      }),
    );

    const content = new VBox({
      align: "left",
      spacing: 8,
      children: [
        planetMassControl,
        planetRadiusControl,
        starMassControl,
        semimajorAxisControl,
        eccentricityControl,
        inclinationControl,
        longitudeControl,
        noiseControl,
        numberControl,
        animationSpeedControl,
        showCurveCheckbox,
        showMeasurementsCheckbox,
        starPropertiesNode,
        periodReadout,
        eclipseDepthReadout,
        eclipseDurationReadout,
      ],
    });

    super(content);

    this.controlsInOrder = [
      planetMassControl,
      planetRadiusControl,
      starMassControl,
      semimajorAxisControl,
      eccentricityControl,
      inclinationControl,
      longitudeControl,
      noiseControl,
      numberControl,
      animationSpeedControl,
      showCurveCheckbox,
      showMeasurementsCheckbox,
    ];
  }
}
