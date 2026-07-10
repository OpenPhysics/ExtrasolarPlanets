# Implementation Notes - Extrasolar Planets

## Architecture overview

Two independent screens, each a standard `Screen<Model, ScreenView>` pairing. Screens share no model
state; they share physics helpers, themed panels, and i18n/colors at the `src/` root and in
`src/common/`.

```
main.ts
  ├─ RadialVelocityScreen          (Screen<RadialVelocityModel, RadialVelocityScreenView>)
  │    ├─ radial-velocity/model/   RadialVelocityModel
  │    └─ radial-velocity/view/    chart, orbit views, control panel, a11y
  └─ TransitScreen                 (Screen<TransitModel, TransitScreenView>)
       ├─ transit/model/           TransitModel, EclipseGeometry
       └─ transit/view/            chart, transit visualization, control panel, a11y

src/common/
  ├─ OrbitalMechanics.ts       Kepler / RV pure helpers (SI)
  ├─ StarProperties.ts         mass → L, T, R, spectral type
  ├─ TimeModel.ts              play/pause + elapsed time
  ├─ ExtrasolarPlanetsPanel.ts pre-themed Panel (ExtrasolarPlanetsColors)
  ├─ Projection3D.ts           orbit / transit 3-D helpers
  ├─ RandomUtils.ts            Marsaglia-polar Gaussian for measurements
  └─ view/                     createNumberControl, chartUtils, StarPropertiesNode

src/preferences/
  ├─ ExtrasolarPlanetsPreferencesModel   empty scaffold (tandem reserved)
  ├─ ExtrasolarPlanetsPreferencesNode
  └─ extrasolarPlanetsQueryParameters
```

Data flows Model → View through AXON `Property` / `DerivedProperty`. Neither model imports from its
`view/`. Educator-facing math: [model.md](./model.md).

## Model components

### RadialVelocityModel (`radial-velocity/model/`)

Owns orbital controls (masses, *a*, *e*, *i*, *ω*), measurement noise / count, phase animation, and
preset selection. Derives period, *K*, systemic velocity, star properties, theoretical RV curve, and
noisy measurement scatter. Composes `TimeModel` for play/pause; `step(dt)` advances orbital phase from
`animationSpeedProperty` (frame-rate independent).

### TransitModel + EclipseGeometry (`transit/model/`)

Same orbital/measurement pattern plus planet radius. Assembles a `TransitSystem` and feeds
`EclipseGeometry` for projected separation, overlap area, normalized flux (no limb darkening), eclipse
interval, depth, and duration. Theoretical flux curve + Gaussian measurements mirror the RV screen.

### Shared pure modules (`common/`)

`OrbitalMechanics` and `StarProperties` are UI-free and unit-tested. Constants / presets / slider ranges
live in `ExtrasolarPlanetsConstants.ts` (Flash-faithful SI values; separate Jupiter-mass constants per
screen).

## View components

Each screen view lays out visualization + bamboo chart + control panel, uses
`ExtrasolarPlanetsPanel` / `ExtrasolarPlanetsColors` (default + projector), and wires Reset All to
`model.reset()`. Shared chart helpers and star-property readouts sit under `common/view/`.

## Preferences

`ExtrasolarPlanetsPreferencesModel` is an empty scaffold — no sim-specific preference Properties yet.
Query-parameter module and Preferences → Simulation node remain wired for future additions.

## Disposal

Screens live for the sim lifetime. Models and views do not tear down mid-session; treat Properties and
listeners as **screen-lifetime** (no per-interaction dispose required for the current architecture).

## Tests

`tests/` covers orbital math and related pure code: `OrbitalMechanics`, `EclipseGeometry`,
`StarProperties`, `RandomUtils`, `Projection3D`, `Presets`, `TimeModel`.

## Multi-screen

Independent-state pattern — see [multi-screen.md](./multi-screen.md). The two NAAP labs are separate
simulators; they share helpers only.
