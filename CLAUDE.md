# CLAUDE.md — Extrasolar Planets

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

SceneryStack port of the NAAP **Extrasolar Planets** lab. Two independent screens teach the radial-velocity (Doppler wobble) and transit (light-curve dip) detection methods. Architecture and formulas: [doc/model.md](doc/model.md), [doc/implementation-notes.md](doc/implementation-notes.md).

- **Radial Velocity** (`src/radial-velocity/`) — RV curve, orbit views (2-D / edge-on / Earth / pseudo-3-D), orbital and measurement controls.
- **Transit** (`src/transit/`) — normalized flux curve, sky-plane crossing visualization, planet radius control.

Shared code uses the `ExtrasolarPlanets` prefix; per-screen code uses `RadialVelocity` / `Transit`. Layout: 1024×618 px.

## Key files

| Area | Location |
|---|---|
| Screens | `src/radial-velocity/RadialVelocityScreen.ts`, `src/transit/TransitScreen.ts` |
| Models | `radial-velocity/model/RadialVelocityModel.ts`, `transit/model/TransitModel.ts`, `transit/model/EclipseGeometry.ts` |
| Shared physics | `src/common/OrbitalMechanics.ts`, `StarProperties.ts`, `RandomUtils.ts`, `Projection3D.ts` |
| Shared views | `src/common/view/chartUtils.ts`, `createNumberControl.ts`, `StarPropertiesNode.ts`, `ExtrasolarPlanetsPanel.ts` |
| Animation | `src/common/TimeModel.ts` (composed into both screen models) |
| Colors / constants | `src/ExtrasolarPlanetsConstants.ts`, `src/ExtrasolarPlanetsColors.ts` |
| Strings | `src/i18n/StringManager.ts` |
| Preferences | `src/preferences/` (empty scaffold + query params) |
| Entry | `src/main.ts` |

## Model

Two **independent** screen models — slider values do not carry between screens. Both use Keplerian two-body orbits and the same main-sequence star property chain (mass → luminosity → temperature → radius → spectral type).

| Screen | Model | Notes |
|---|---|---|
| **Radial Velocity** | `RadialVelocityModel` | Orbital sliders + noise/measurement count; derived period, amplitude *K*, theoretical curve, noisy scatter; optional four orbit perspectives driven by `phaseProperty`; default phase 0 (periapsis) |
| **Transit** | `TransitModel` + `EclipseGeometry.ts` | Adds `planetRadiusProperty`; derived eclipse depth/duration, flux curve, measurements; default phase 0.5; no limb darkening |

**Shared gotchas**

- RV amplitude uses the **Flash/NAAP approximation** `a₁ = (Mp/M★)·a`, not the full reduced-mass textbook form — preserve unless porting fidelity changes.
- UI label **"Longitude"** is argument of periapsis **ω** (Flash naming).
- Simulated measurements are regenerated via `Multilink` + mutable `Property`, not `DerivedProperty`, so scatter stays stable until inputs change.
- Preset names are English proper nouns and are **not localized**; presets set orbital parameters only (not noise, measurement count, animation speed, or phase).

## Accessibility

Follows the shared [OpenPhysics accessibility convention](https://github.com/OpenPhysics/Baton/blob/main/ACCESSIBILITY.md).
Each screen registers `*ScreenSummaryContent` and `*KeyboardHelpContent`, with explicit `pdomOrder` on a wrapper `Node`. A11y strings live under `a11y.radialVelocity` and `a11y.transit` in each locale JSON, via `StringManager.getRadialVelocityA11yStrings()` / `getTransitA11yStrings()`. Keep `currentDetailsContent` live over model state; every interactive node needs an `accessibleName`.

## Testing

Fleet-standard Vitest layout:

| Path | Purpose |
|---|---|
| `vitest.config.ts` | Test environment + `setupFiles`; `execArgv: ["--expose-gc"]` with memory-leak suite |
| `tests/setup.ts` | Canvas / AudioContext mocks + `init({ name: "…" })` before SceneryStack imports |
| `tests/**/*.test.ts` | Model/physics unit tests |
| `tests/memory-leak.test.ts` | WeakRef + `forceGC` dispose regression (fleet pattern) |

| File | Covers |
|---|---|
| `OrbitalMechanics.test.ts` | Kepler period, anomalies, *K*, center velocity |
| `EclipseGeometry.test.ts` | Overlap, HD 209458 b geometry |
| `StarProperties.test.ts` | Sun, M-dwarf, spectral table |
| `RandomUtils.test.ts` | `polarGaussian` statistics |
| `Projection3D.test.ts` | Rotations, `orbitalPlanePosition` |
| `Presets.test.ts` | Preset + reset on both models |
| `TimeModel.test.ts` | Play/pause/reset |
| `memory-leak.test.ts` | `TimeModel` dispose + GC |

- Put unit tests only under root `tests/` (never co-locate or use `__tests__/`).
- Run `npm test`. CI runs the suite when a `test` script is present.

## Commands

```bash
npm run lint && npm run check && npm run build && npm test
```

## Development notes

- Pure physics lives in `src/common/` and `EclipseGeometry.ts` with zero SceneryStack imports.
- Separate Jupiter-mass constants for RV vs Transit sliders (`RV_M_JUP_KG` vs `TRANSIT_M_JUP_KG`).
- After `npm run build`, the sim is installable offline via Workbox (`dist/manifest.webmanifest`).
