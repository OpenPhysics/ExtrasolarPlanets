/**
 * main.ts
 *
 * Entry point for the simulation. Initializes SceneryStack, creates the
 * screen, and starts the main event loop.
 *
 * !! CRITICAL IMPORT ORDER !!
 * brand.js MUST be the first import. It triggers the full bootstrap chain:
 *
 *   brand.ts → splash.ts → assert.ts → init.ts
 *
 * SceneryStack requires this exact load order. Never reorder these imports.
 */

// brand.js MUST be first — triggers: init.ts → assert.ts → splash.ts → brand.ts
import "./brand.js";

import { onReadyToLaunch, PreferencesModel, Sim } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import ExtrasolarPlanetsColors from "./ExtrasolarPlanetsColors.js";
import { StringManager } from "./i18n/StringManager.js";
import { ExtrasolarPlanetsPreferencesModel } from "./preferences/ExtrasolarPlanetsPreferencesModel.js";
import { ExtrasolarPlanetsPreferencesNode } from "./preferences/ExtrasolarPlanetsPreferencesNode.js";
import { RadialVelocityScreen } from "./radial-velocity/RadialVelocityScreen.js";
import { TransitScreen } from "./transit/TransitScreen.js";

onReadyToLaunch(() => {
  const stringManager = StringManager.getInstance();
  const screenNames = stringManager.getScreenNames();

  // Simulation-specific preferences; initial values come from extrasolarPlanetsQueryParameters.
  const simPreferences = new ExtrasolarPlanetsPreferencesModel(Tandem.ROOT.createTandem("preferences"));

  // Screen name Properties update automatically when the locale changes.
  const screens = [
    new RadialVelocityScreen({
      name: screenNames.radialVelocityStringProperty,
      tandem: Tandem.ROOT.createTandem("radialVelocityScreen"),
      backgroundColorProperty: ExtrasolarPlanetsColors.backgroundColorProperty,
    }),
    new TransitScreen({
      name: screenNames.transitStringProperty,
      tandem: Tandem.ROOT.createTandem("transitScreen"),
      backgroundColorProperty: ExtrasolarPlanetsColors.backgroundColorProperty,
    }),
  ];

  const sim = new Sim(stringManager.getTitleStringProperty(), screens, {
    preferencesModel: new PreferencesModel({
      visualOptions: {
        // Adds a "Projector Mode" toggle in Preferences → Visual
        supportsProjectorMode: true,
        // Enables keyboard-navigation highlight outlines
        supportsInteractiveHighlights: true,
      },
      simulationOptions: {
        customPreferences: [
          {
            createContent: (tandem: Tandem) => new ExtrasolarPlanetsPreferencesNode(simPreferences, tandem),
          },
        ],
      },
      localizationOptions: {
        // Adds a language picker in Preferences → Language
        supportsDynamicLocale: true,
      },
    }),

    // Optional: fill in credits shown in Help → About
    credits: {
      leadDesign: "",
      softwareDevelopment: "",
      team: "",
      qualityAssurance: "",
    },
  });

  sim.start();
});
