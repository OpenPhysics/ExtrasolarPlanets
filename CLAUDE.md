# CLAUDE.md — Extrasolar Planets

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

A two-screen SceneryStack simulation (~4,060 lines across 38 source files) about detecting extrasolar planets, scaffolded from `TemplateSingleSim`:

- **Radial Velocity** (`src/radial-velocity/`) — the radial-velocity (Doppler wobble) method. RV curve chart, orbit visualization (2-D/Edge-on/Earth/pseudo-3-D views), control panel with orbital/measurement sliders + preset ComboBox.
- **Transit** (`src/transit/`) — the transit (light-curve dip) method. Light-curve chart, star/planet sky-plane visualization, control panel with planet/orbital/measurement sliders + preset ComboBox.

Shared code uses the `ExtrasolarPlanets` prefix; per-screen code uses `RadialVelocity` / `Transit` prefixes. Layout: 1024×618 px.

## Key files

| File | Lines | Purpose |
|---|---|---|
| `src/main.ts` | 79 | Entry point, screen registration, Sim construction with preferences |
| `src/init.ts` | 44 | SceneryStack init: `"extrasolar-planets"`, `"0.0.0"`, `"made-with-scenerystack"`, locales `["en","es","fr"]` |
| `src/brand.ts` | 51 | Brand info for About dialog, logo, copyright |
| `src/ExtrasolarPlanetsConstants.ts` | 415 | All numeric constants: layout, physics SI units (G, AU, M_SUN, M_JUP, etc.), Range/Default values for all sliders, preset definitions, chart dimensions |
| `src/ExtrasolarPlanetsColors.ts` | 145 | ~15 `ProfileColorProperty` definitions with `"default"` and `"projector"` profiles |
| `src/ExtrasolarPlanetsNamespace.ts` | 16 | Namespace `"extrasolar-planets"` for color properties |
| `src/i18n/StringManager.ts` | 124 | Singleton localized string accessor; per-screen name + a11y getters; compile-time key parity checks across locales |
| `src/i18n/strings_en.json` | | English locale strings |
| `src/i18n/strings_es.json` | | Spanish locale strings |
| `src/i18n/strings_fr.json` | | French locale strings |

### Radial Velocity screen (`src/radial-velocity/`)

| File | Lines | Purpose |
|---|---|---|
| `RadialVelocityScreen.ts` | 39 | `Screen<RadialVelocityModel, RadialVelocityScreenView>` wrapper |
| `model/RadialVelocityModel.ts` | 275 | `implements TModel`: orbital controls (planetMass, starMass, semimajorAxis, eccentricity, inclination, longitude), measurement controls (noise, numberOfMeasurements), view toggles (showTheoreticalCurve, showSimulatedMeasurements, showMultipleViews), animation (timer, phaseProperty, animationSpeedProperty), derived observables (period, amplitude K, theoreticalCurve, measurements), presetProperty |
| `view/RadialVelocityScreenView.ts` | 122 | Top-level view: RV chart (top-left), orbit views (below chart), control panel (top-right), time control + Reset All |
| `view/RadialVelocityChartNode.ts` | 183 | RV (m/s) vs phase (0–1) bamboo chart: `LinePlot` for theoretical curve, `ScatterPlot` for measurements, auto-scaled y-axis |
| `view/OrbitViewsNode.ts` | 252 | Orbit visualization from 4 perspectives: 2-D (top-down), Side (edge-on), Earth (sky projection), pseudo-3-D (via `Projection3D`). Driven by `phaseProperty`. |
| `view/RadialVelocityControlPanel.ts` | 201 | Orbital + measurement sliders (via `createNumberControl`), view-toggles, star-property readout (`StarPropertiesNode`), period/amplitude readouts, preset ComboBox |
| `view/RadialVelocityKeyboardHelpContent.ts` | | Keyboard-help dialog content |
| `view/RadialVelocityScreenSummaryContent.ts` | | Accessible screen summary |

### Transit screen (`src/transit/`)

| File | Lines | Purpose |
|---|---|---|
| `TransitScreen.ts` | 39 | `Screen<TransitModel, TransitScreenView>` wrapper |
| `model/TransitModel.ts` | 273 | `implements TModel`: planet controls (planetMass, planetRadius, starMass, semimajorAxis, eccentricity, inclination, longitude), measurement controls (noise, numberOfMeasurements), view toggles (showTheoreticalCurve, showSimulatedMeasurements), animation (timer, phaseProperty, animationSpeedProperty), derived observables (transitSystem, fluxCurve, measurements, systemPeriod, eclipseDepth, eclipseDuration), presetProperty |
| `model/EclipseGeometry.ts` | 325 | Pure-function physics port of NAAP Flash `Lightcurve Component II.as`. Types: `TransitSystem`, `EclipseInterval`. Functions: `normalizedFluxAtPhase()`, `eclipseDepth()`, `findEclipseInterval()`, `projectedSeparation()`. No limb darkening. |
| `view/TransitScreenView.ts` | 118 | Top-level view: flux chart (top-left), visualization (below chart), control panel (top-right), time control + Reset All |
| `view/TransitChartNode.ts` | 209 | Light-curve chart: normalized flux vs phase, `LinePlot` + `ScatterPlot` + horizontal reference line + eclipse-duration arrow |
| `view/TransitVisualizationNode.ts` | 125 | Sky-plane visualization: star disk + planet crossing front, driven by projected separation |
| `view/TransitControlPanel.ts` | 218 | Planet/orbital/measurement sliders, view-toggles, star-property readout, period/eclipse-depth/eclipse-duration readouts, preset ComboBox |
| `view/TransitKeyboardHelpContent.ts` | | Keyboard-help dialog content |
| `view/TransitScreenSummaryContent.ts` | | Accessible screen summary |

### Common (`src/common/`)

| File | Lines | Purpose |
|---|---|---|
| `TimeModel.ts` | 83 | Composable play/pause + elapsed-time model (`isPlayingProperty`, `timeProperty`, `step(dt)`, `reset()`) |
| `OrbitalMechanics.ts` | 145 | Pure two-body helpers: `keplerPeriodSeconds()`, `radialVelocityAmplitude()`, `radialVelocityAtTrueAnomaly()`, `meanToTrueAnomaly()`, `meanToEccentricAnomaly()`, `eccentricToTrueAnomaly()`, `phaseFromTrueAnomaly()`, `centerVelocity()` |
| `Projection3D.ts` | 70 | 3-D math: `rotateX()`, `rotateY()`, `orbitalPlanePosition()`, `projectToScreen()` |
| `StarProperties.ts` | 276 | Main-sequence star derivation (mass→luminosity→temperature→radius→spectral type). Transcribed from NAAP Flash `DoAction.as`. |
| `RandomUtils.ts` | 45 | Gaussian noise via Marsaglia polar method |
| `ExtrasolarPlanetsPanel.ts` | 45 | Pre-themed `Panel` wrapper using `ExtrasolarPlanetsColors` |
| `view/chartUtils.ts` | 84 | Shared chart helpers: `niceStep()`, `decimalPlacesForStep()`, `formatTickValue()`, `computeCurveYRange()` |
| `view/createNumberControl.ts` | 66 | Factory for themed `NumberControl` sliders with localized units, accessible names |
| `view/StarPropertiesNode.ts` | 49 | Read-only row: star spectral type, temperature, radius from live `StarProperties` Property |

### Preferences (`src/preferences/`)

| File | Lines | Purpose |
|---|---|---|
| `extrasolarPlanetsQueryParameters.ts` | | URL query params via `QueryStringMachine` (none yet) |
| `ExtrasolarPlanetsPreferencesModel.ts` | | Empty scaffold for future sim-specific preferences |
| `ExtrasolarPlanetsPreferencesNode.ts` | | Preferences → Simulation tab header (no controls yet) |

## Common components

### ExtrasolarPlanetsPanel

Every control panel and info box should use `ExtrasolarPlanetsPanel` so that default/projector color switching is automatic:

```typescript
import { ExtrasolarPlanetsPanel } from "../../common/ExtrasolarPlanetsPanel.js";
const panel = new ExtrasolarPlanetsPanel(content);              // default colors
const panel = new ExtrasolarPlanetsPanel(content, { xMargin: 20 }); // override PanelOption
```

### TimeModel

For animation, compose `TimeModel` into your screen model:

```typescript
import { TimeModel } from "../../common/TimeModel.js";

export class MyModel implements TModel {
  public readonly timer = new TimeModel();

  public step(dt: number): void {
    this.timer.step(dt);
    // use this.timer.timeProperty.value
  }
  public reset(): void { this.timer.reset(); }
}
```

Wire view to `TimeControlNode` from `scenerystack/scenery-phet` binding on `model.timer.isPlayingProperty`.

### createNumberControl

Use for consistent slider styling across screens:

```typescript
import { createNumberControl } from "../../common/view/createNumberControl.js";
createNumberControl(property, rangeProperty, decimalPlaces, unitsString, labelString, accessibleName);
```

### chartUtils

```typescript
import { niceStep, decimalPlacesForStep, formatTickValue, computeCurveYRange } from "../../common/view/chartUtils.js";
```

## Accessibility

Each screen registers its own `*ScreenSummaryContent` and an explicit `pdomOrder` + `*KeyboardHelpContent`. A11y strings live under per-screen keys in the `a11y` block of each locale JSON, exposed via `StringManager.getRadialVelocityA11yStrings()` / `getTransitA11yStrings()`. Make each `currentDetailsContent` a live `DerivedProperty` over model state and add `accessibleName`s to every interactive node.

## Tests

```sh
npm test          # vitest run
npm run test:watch # vitest in watch mode
```

## npm scripts

| Script | Command |
|---|---|
| `start` / `dev` | `vite` |
| `build` | `tsc && vite build` |
| `build:single` | `tsc && vite build --mode single` |
| `lint` | `biome check .` |
| `format` | `biome format --write .` |
| `fix` | `biome check --write .` |
| `check` | `tsc --noEmit && tsc -p tsconfig.scripts.json --noEmit` |
| `release` | check + lint + build + version patch + git push |
| `test` | `vitest run` |
| `icons` | `tsx scripts/generate-icons.ts` |
| `decompile` | `tsx scripts/decompile-flash.ts` |
| `rename` | `tsx scripts/rename-sim.ts` |

## Multi-screen conventions

- Screen directories mirror `src/radial-velocity/` structure for new screens
- Screen-name keys in all locale JSON files
- Per-screen `StringProperty` getters in `StringManager.getScreenNames()`
- Register all screens in the `screens` array in `main.ts`
- See `doc/multi-screen.md` for full guide

## PWA

After `npm run build`, the sim is installable offline via Workbox (`dist/manifest.webmanifest`).

## Testing

Fleet-standard Vitest layout:

| Path | Purpose |
|---|---|
| `vitest.config.ts` | Test environment + `setupFiles` when present; `execArgv: ["--expose-gc"]` with memory-leak suite |
| `tests/setup.ts` | Canvas / AudioContext mocks + `init({ name: "…" })` before SceneryStack imports (when required) |
| `tests/**/*.test.ts` | Model/physics unit tests — mirror `src/` under `tests/` |
| `tests/memory-leak.test.ts` | WeakRef + `forceGC` dispose regression (fleet pattern) |

- Put unit tests only under root `tests/` (never co-locate or use `__tests__/`).
- Run `npm test`. CI runs the suite when a `test` script is present.
- Expand `memory-leak.test.ts` for components that add/remove nodes or link Properties at runtime (see OpticsLab).
