# Port the NAAP "Extrasolar Planets" Lab to SceneryStack

## Context

The NAAP Extrasolar Planets lab is two Flash (ActionScript 2) simulators — **Exoplanet
Radial Velocity** and **Exoplanet Transit** — that teach how planets outside our solar
system are detected via the Doppler-wobble and light-curve-dip methods. The original
`.swf`/`.fla` sources live under `NAAP/` in this repo (physics is embedded as readable
ActionScript inside the FLA binaries and has been fully extracted — see formulas below).

This project is a SceneryStack two-screen sim scaffolded from `TemplateSingleSim`; both
`radial-velocity/` and `transit/` screens are currently empty placeholders (background +
centered label + Reset All). The goal is a faithful, modern, accessible TypeScript port of
both simulators with charts, orbit/transit visualizations, presets, noise/measurement
modeling, and animation.

**Decisions locked with the user:**
- **Scope:** build **both screens in parallel** (shared core first, then both).
- **RV views:** reproduce **all four** sub-views — side, earth, 2D orbit, **and the rotating 3D orbit view** (the design agent's "skip 3D" suggestion is overridden).
- **Physics:** **faithful port** — preserve the Flash approximations exactly (see Fidelity section). Match the published student guide / answer keys.

## Source references (`NAAP/`) — what to consult while porting

All paths are relative to the repo root. Open `.swf` in a browser (Ruffle) to observe
behavior; **`.fla` are compressed binaries** — to read the embedded ActionScript, decompile
with JPEXS FFDec. `.note` files are one-line per-version changelogs. The numeric formulas in
the Physics section below were extracted from these sources.

**The two simulators being ported (canonical latest versions):**

| Screen | Source `.fla` (edit history) | Runnable `.swf` |
|---|---|---|
| Radial Velocity | `NAAP/flash-animations/flashdev2/radialVelocitySimulator/radialVelocitySimulator012.fla` | `…/radialVelocitySimulator012.swf` |
| Transit | `NAAP/flash-animations/flashdev2/transitSimulator/transitSimulator017.fla` | `…/transitSimulator017.swf` |

(Older/alt cuts `…011`, `…012-B/C/D`, `…017-B/C/D` sit alongside — ignore unless `012`/`017` is ambiguous.)

**Deployed copies + visual target (the reference behavior and look to match):**

- RV: `NAAP/astroUNL/naap/esp/animations/radialVelocitySimulator.{swf,html,jpg}`
- Transit: `NAAP/astroUNL/naap/esp/animations/transitSimulator.{swf,html,jpg}`
- (the `.jpg`s are the reference screenshots for the screenshot diff in Verification §5)

**Numeric ground truth — presets, expected outputs, answer key:**

- `NAAP/astroUNL/naap/esp/naap_esp_sg.pdf` (student guide; editable `…sg.doc` alongside)
- duplicate: `NAAP/naap-air-app/files/esp/naap_esp_sg.pdf`

**Lab instruction pages (what each control teaches — pedagogical context, not physics):**

- `NAAP/astroUNL/naap/esp/`: `esp.html` (landing) · `introduction.html` · `detection.html` · `dopplereffect.html` · `centerofmass.html` · `esp_i.html` (instructor) · `esp_po.html`

**Readable ActionScript physics (NOT inside the FLAs — actual `.as` you can read directly):**

- **Transit blackbody flux + disk overlap + bolometric correction** →
  `NAAP/flash-animations/flashdev2/variableStarLabs/older/StarFieldComponent/edu/unl/astro/starField/EclipsingBinary.as`.
  This is the source of the transit flux math (the `_H1`/`_H2` occulted-body selection, `getBolometricCorrection()`, `overlap`, `maxVisFlux = (R1²·H1 + R2²·H2)·π`, the `1.89553328524593e-43` flux constant) — the transit star physics is **shared with the Variable Star lab**. (Duplicated under `StarFieldComponent3/…` and `starFieldEditor/EclipsingBinary.as`.)

**Supporting concept/component FLAs (binary — decompile if you need detail):**

- Gaussian noise (**Marsaglia polar method** — see verification note below) → `gaussianRandomNumber/gaussianRandomNumber001.fla` (drives `RandomUtils.ts`)
- Spectral type ↔ temperature table → `typeAndTemp/typeAndTemp014.fla` (drives `StarProperties.ts`)
- Blackbody curve → `simpleBlackbody/simpleBlackbody017.fla`; sci-notation/formatting → `numberFunctions/numberFunctions002.fla`, `toFixed/`, `sci_not/`
- RV building blocks → `radialVelocityComponent/radialVelocityComponent010.fla`, `radialVelocityDemo/radialVelocityDemo003.fla`, `centerOfMass/`, `exoplanetOrbitDiagram/`, `exoplanetComboDiagram/`
- Transit building blocks → `transitMovie/transitMovie041.fla`, `lightcurveComponentII/`
- ESP background concept animations → `NAAP/naap-air-app/src-background-pages/esp/{esp-intro,esp-detection,esp-doppler,esp-center-of-mass}.fla`

### Decompiling the Flash sources

`npm run decompile` (script: `scripts/decompile-flash.ts`) extracts readable ActionScript
from the Flash movies so the ported physics can be diffed against the originals. The `.fla`
files are old binary projects no tool reads directly, so the script decompiles their sibling
compiled `.swf` (passing a `.fla` resolves to its `.swf` automatically) via **JPEXS FFDec**.

```sh
npm run decompile                 # the two ESP simulators → NAAP/decompiled/<name>/scripts/*.as
npm run decompile -- --all        # all ESP-relevant movies (the curated list above)
npm run decompile -- --list       # dry run: print what would be decompiled, run nothing
npm run decompile -- <path>…      # specific .swf / .fla / folder
npm run decompile -- --assets     # also export images/shapes/sounds/text
npm run decompile -- --xfl        # reconstruct an editable XFL project (closest to the .fla)
```

Output goes to `NAAP/decompiled/` (git-ignored). **One-time setup** — FFDec needs a Java
runtime:

```sh
sudo apt install default-jre               # Debian/WSL (or: brew install temurin on macOS)
npm run decompile -- --setup               # downloads FFDec into tools/ffdec/ (git-ignored)
# …or point at an existing install instead: export FFDEC_JAR=/path/to/ffdec.jar
```

Run `npm run decompile -- --help` for all flags. The decompiled AS is a **read-only
reference** (AS2, lightly mangled by the compiler) — transcribe the maths into typed TS in
`src/`; don't vendor it. `EclipsingBinary.as` above is already readable without decompiling.

#### Verified against the decompiled source (✓ = confirmed in the AS)

The physics below was cross-checked against the decompiled `Radial Velocity Component.as`,
`Binary System Component.as`, `transitSimulator017/…/DoAction_3.as`, and `Lightcurve
Component II.as`. **Confirmed:** RV `M_jup=1.899e27` vs transit `M_jup=1.8987e27` (`mass1×1.98892e30`,
`mass2×1.8987e27` in `DoAction_3.as`); `a2=separation`, `a1=(m2/m1)·separation`; `P=√(4π²a2³/(G·Σm))`
with `4π²=39.47841760435743`, `G=6.673e-11`; `K=(2π/P)·a1·sin i/√(1−e²)`; `centerVelocity=K·e·cos ω`;
Newton step `E←E+(M+e·sinE−E)/(1−e·cosE)` seeded `E0=M`; transit planet temp fixed `500 K`;
flux `Z=1.89553328524593e-43·T⁴·10^(BC/2.5)`, `BC` 5th-order poly in `log10 T`; `normalizedFlux=visFlux/maxVisFlux`.
Both **preset tables** (RV 7, Transit 11) were transcribed verbatim from `…/DoAction_2.as` (see Physics §).
Kepler spot-checks pass: RV Option A → 365.07 d; transit `systemPeriod=√(39.47841760435743·a³/(6.673e-11·Σm))`.
**Corrected three plan errors** (folded into the sections below):
- The Gaussian is the **Marsaglia polar method** (`do { x1=2r−1; x2=2r−1; o=x1²+x2² } while(o≥1); o=√(−2·ln o/o)`),
  **not** classic trig Box–Muller. Same distribution, different algorithm — matters for bit-exact scatter under a seeded RNG.
- The transit `maxVisFlux` factor is **π**, not `1.52183774688135e18` (it cancels in `normalizedFlux`, so the port is unaffected).
- There is **no `max(noise, 0.1)` floor** on RV measurements: σ is the noise slider value directly; `noMeasurementsNoise=0.1`
  is only the y-axis plot margin used when measurements are hidden.

## API ground-truth (verified in node_modules — drives several choices)

- `scenerystack/bamboo` exports `AxisLine, ChartRectangle, ChartTransform, GridLineSet, LinePlot, ScatterPlot, TickLabelSet, TickMarkSet`. **There is no `LabelSet`** — axis numeric labels use **`TickLabelSet(chartTransform, orientation, spacing, { createLabel })`**.
- `Orientation` (HORIZONTAL/VERTICAL) imports from **`scenerystack/phet-core`**, not bamboo/dot. Every bamboo annotation ctor needs it.
- `ModelViewTransform2` imports from **`scenerystack/phetcommon`**; use `ModelViewTransform2.createRectangleInvertedYMapping(modelBounds, viewBounds)` for AU→pixels (y-down).
- `ComboBox(property, items, listParent, options)` — items are `{ value, createNode: (tandem)=>Node, accessibleName? }` (factory key is **`createNode`**, not `node`). Requires a top-level **`listParent` Node** per ScreenView so the dropdown renders above panels.
- `NumberProperty` `units` is validated against a fixed allow-list. **`MJupiter`/`MSun`/`RJupiter` are NOT allowed and will assert** — omit `units` for those and render units via `numberDisplayOptions.valuePattern` + a unit StringProperty. (`AU` and `s` are allowed.)
- `LinePlot`/`ScatterPlot` support `setDataSet(...)` + `update()`; `null` entries in a LinePlot dataset create gaps (useful for eclipse/phase-wrap).
- `axon` has `PatternStringProperty`, `DerivedProperty`, `Multilink`, `MappedProperty` — use `PatternStringProperty` for all readouts and live a11y details.

## Physics (faithful — SI; constants are the Flash values)

> Source of truth for the formulas below: the two simulator FLAs (`radialVelocitySimulator012.fla`,
> `transitSimulator017.fla`) for RV/transit logic, and `EclipsingBinary.as` for the transit flux/overlap
> block. Spot-check derived numbers against `naap_esp_sg.pdf`. See "Source references" above for paths.

Shared: `G=6.673e-11`, `M_SUN=1.98892e30 kg`, `AU=1.49598e11 m`, `day=86400 s`.

**Radial Velocity** (`M_jup=1.899e27`):
- `a2 = a`; `a1 = (m2/m1)·a` ← keep this approximation. `P = sqrt(4π²·a2³/(G(m1+m2)))`.
- `K = (2π/P)·a1·sin(i)/sqrt(1−e²)`; `centerVelocity = K·e·cos(ω)`; `period_days = P/86400`.
- Curve: `v(phase) = K·cos(ω+ta) + centerVelocity`, `ta = meanToTrue(2π·phase, e)`.
- Measurements: random mean anomaly → `meanToTrue` → `v + Gaussian(0, noise)` via the **Marsaglia polar method** (σ = noise slider value directly; no `max(…,0.1)` floor). `ω=longitude·π/180`, `i=inclination·π/180`.

**Transit** (`M_jup=1.8987e27`, `R_jup=7.1492e7 m`, `R_sun=6.955e8 m`, planet temp fixed `500 K`):
- `P = sqrt(4π²a³/(G(m1+m2)))`; `eclipseDuration = P·eclipse.durationPhase`.
- Eclipse geometry: `R=(r1+r2)/a`, `S2=cos²i`, `S1=1−S2`; `f(v)=K1·cos(v+ω)²+K2·cos(v)²+K3·cos(v)+K4` with `K1=(1−e²)²S1, K2=−e²R², K3=−2eR², K4=(1−e²)²S2−R²`; eclipse where `f<0` (root-find over true anomaly).
- Overlap area (uniform disks): `ca=clamp(d/(2r2)+(r2²−r1²)/(2r2·d),−1,1)`, `cb=clamp(...)`, `overlap=r2²(α−ca·sinα)+r1²(β−cb·sinβ)`, `α=acos(ca), β=acos(cb)`.
- Flux (blackbody disks, NO limb darkening): `Z_k=1.89553328524593e-43·T_k⁴·10^(BC_k/2.5)`; `maxVisualFlux=(r1²Z1+r2²Z2)·π`; `visualFlux = maxVisualFlux − Z_occulted·overlap`; **normalizedFlux = visualFlux/maxVisualFlux** (the `π` cancels here). `BC(T)` = piecewise 5th-order poly in `log10 T`.
- Star props from mass: `L = M<0.43 ? 0.2322·M^2.26 : M^3.99`; `logT=poly(log10 L)→T=10^logT`; `R=33736108.2311059·sqrt(L)/T²`; spectral type via linear interp in the class-V `{type,temp}` table (O7 38000 … M6 2850).

Presets (set param tuples only — not noise/number/phase). **Verified verbatim from the decompiled
source** (`…/DoAction_2.as` in each sim); the `name` strings (with the `"N. "` prefix) are the
ComboBox labels. Slider order differs per screen — columns below match each sim's `presetsList`.

**RV** (`radialVelocitySimulator012/…/DoAction_2.as`) — `starMass` M☉, `planetMass` M_jup, `eccentricity`, `separation` AU, `inclination` °, `longitude` °:

| # | name | starMass | planetMass | ecc | separation | incl | long |
|---|------|---------:|-----------:|----:|-----------:|-----:|-----:|
| 1 | Option A | 1 | 1 | 0 | 1 | 90 | 0 |
| 2 | Option B | 1 | 1 | 0.4 | 1 | 90 | 0 |
| 3 | Option C | 1 | 0.05 | 0 | 1 | 90 | 0 |
| 4 | Option D | 1 | 0.00315 | 0 | 1 | 90 | 0 |
| 5 | HD 68988 b | 1.2 | 1.9 | 0.14 | 0.071 | 90 | 40 |
| 6 | HD 33564 b | 1.25 | 9.1 | 0.34 | 1.1 | 90 | 205 |
| 7 | HD 39091 b | 1.1 | 10.35 | 0.62 | 3.29 | 90 | 331 |

**Transit** (`transitSimulator017/…/DoAction_2.as`) — `planetMass` M_jup, `planetRadius` R_jup, `starMass` M☉, `separation` AU, `eccentricity`, `inclination` °, `longitude` °:

| # | name | planetMass | planetRadius | starMass | separation | ecc | incl | long |
|---|------|-----------:|-------------:|---------:|-----------:|----:|-----:|-----:|
| 1 | Option A | 1 | 1 | 1 | 1 | 0 | 90 | 0 |
| 2 | Option B | 0.0032 | 0.09 | 1 | 1 | 0 | 90 | 0 |
| 3 | OGLE-TR-113 b | 1.32 | 1.09 | 0.78 | 0.0229 | 0 | 89.4 | 0 |
| 4 | TrES-1 | 0.61 | 1.08 | 0.87 | 0.0393 | 0.135 | 88.2 | 0 |
| 5 | XO-1 b | 0.9 | 1.3 | 1 | 0.0488 | 0 | 87.7 | 0 |
| 6 | HD 209458 b | 0.69 | 1.32 | 1.01 | 0.045 | 0.07 | 86.929 | 83 |
| 7 | OGLE-TR-111 b | 0.53 | 1 | 0.82 | 0.047 | 0 | 86.5 | 0 |
| 8 | OGLE-TR-10 b | 0.54 | 1.16 | 1.22 | 0.04162 | 0 | 86.46 | 0 |
| 9 | HD 189733 b | 1.15 | 1.154 | 0.82 | 0.0313 | 0 | 85.79 | 0 |
| 10 | HD 149026 b | 0.36 | 0.725 | 1.3 | 0.042 | 0 | 85.3 | 0 |
| 11 | OGLE-TR-132 b | 1.19 | 1.13 | 1.35 | 0.0306 | 0 | 85 | 0 |

## Implementation

### 1. Shared core (`src/common/` + constants) — pure, no UI, fully unit-tested

- **`ExtrasolarPlanetsConstants.ts`** — add SI constants (`G_SI, M_SUN_KG, AU_M, SECONDS_PER_DAY, RV_M_JUP_KG=1.899e27, TRANSIT_M_JUP_KG=1.8987e27, R_JUP_M, R_SUN_M, PLANET_TEMP_K=500, NO_MEASUREMENTS_NOISE=0.1`), all slider `Range`s + `*_DEFAULT`s (see slider tables in the Flash extraction — RV ecc cap 0.8, Transit ecc cap 0.4), and layout sizes (`CHART_VIEW_WIDTH/HEIGHT, ORBIT_VIEW_SIZE`). Register on the namespace.
- **`OrbitalMechanics.ts`** (new) — pure functions: `keplerPeriodSeconds(totalMassKg, aM)`, `eccentricToTrueAnomaly(E,e)` (atan2 form, wrap-safe), `eccentricToMeanAnomaly(E,e)`, `meanToEccentricAnomaly(M,e,tol=1e-8,maxIter)` (Newton, seed E0=M), `meanToTrueAnomaly(M,e)`, `kFactor(e)`, `radialVelocityAmplitude(...)`.
- **`RandomUtils.ts`** (new) — `polarGaussian(mean, stdDev, nextDouble = ()=>dotRandom.nextDouble())` implementing the **Marsaglia polar method** (the Flash form — reject-sample `x1,x2∈[−1,1]` with `s=x1²+x2²<1`, scale by `√(−2·ln s/s)`), with injectable uniform source for deterministic tests. (Verify `dotRandom` export from `scenerystack/dot` in M0; fall back to `Math.random` default if absent.) Source: the polar draw in `Radial Velocity Component.as` / `Lightcurve Component II.as`.
- **`StarProperties.ts`** (new) — `deriveStarProperties(starMassMsun): { luminosity, temperatureK, radiusM, spectralType }` + exported `SPECTRAL_TYPES_AND_TEMPS` table. Source: `typeAndTemp014.fla`; bolometric/luminosity relations cross-check against `EclipsingBinary.as`.
- **`Projection3D.ts`** (new, for the RV 3D view) — a small perspective/orthographic projector: rotate orbit-plane points by inclination + longitude, project to 2D. Pure math returning `Vector2`s so the 3D view is plain `Path`/`Line` scenery (no WebGL). Keeps the rotating 3D orbit view fully themeable and animatable. (Alternative: `scenerystack/mobius` Three.js — heavier; chosen against for a 2D scenery sim.)
- **`src/transit/model/EclipseGeometry.ts`** (new, transit-only) — `eclipseFlux`, `findEclipseInterval` (handles non-transiting → zero/empty interval), `circleCircleOverlapArea`, `blackbodyVisualFactor`, `bolometricCorrection`, `normalizedFluxAtPhase`. **Port directly from `EclipsingBinary.as`** (`getBolometricCorrection`, the `overlap`/`alpha`/`beta` block, `_H1`/`_H2` occulted-body selection, `maxVisFlux`) — that file is the readable source for this whole module.

### 2. Models (`src/<screen>/model/<Screen>Model.ts`)

Keep `implements TModel`; compose `TimeModel` for animation. Each control is a `NumberProperty`/`BooleanProperty` with a shared `Range` constant; `presetProperty: Property<Preset>` from a frozen presets array (`lazyLink → applyPreset`).

- **Derived outputs** via `DerivedProperty`: RV → `periodDays, amplitude (K), centerVelocity, starProperties, theoreticalCurve (Vector2[])`. Transit → `systemPeriodDays, starProperties, eclipseInterval, eclipseDurationHours, fluxCurve, eclipseDepth`.
- **Measurements** via a single `Multilink` over the physics inputs (+noise/number) calling `regenerateMeasurements()`, so random scatter is stable and re-rolled only when inputs change (not per-dependency, not eagerly on every derived recompute).
- **`step(dt)`**: advance `timer` by `dt·timeSpeed`; set `phaseProperty = (time/periodDays) % 1` to drive the moving chart indicator + orbit animation.
- **`applyPreset(preset)`**: set the param tuple (`.value =` sequential is fine). **`reset()`**: reset every Property + `timer`, then `regenerateMeasurements()`.

### 3. Views — thin `*ScreenView.ts` orchestrators + one node file per responsibility

Shared: **`StarPropertiesNode.ts`** (panel of `PatternStringProperty` readouts: spectral type / temp K / radius R☉) and a **`createNumberControl.ts`** factory (themed `NumberControl` with `valuePattern` units + `accessibleName`). Each ScreenView adds a top-level `comboBoxListParent` Node and updates `pdomOrder` (combo → number controls → checkboxes → time control → reset).

**Radial Velocity:**
- `RadialVelocityChartNode.ts` — bamboo RV-vs-phase chart: `ChartTransform` (`modelXRange 0–1`, `modelYRange` derived from amplitude) → `ChartRectangle` → `GridLineSet`×2 → `TickMarkSet`×2 → `TickLabelSet`×2 (`createLabel: v=>new Text(Utils.toFixed(v,1))`) → `AxisLine`×2 → `LinePlot` (theoretical, vis-bound to `showTheoreticalCurve`) → `ScatterPlot({radius:2})` (measurements, vis-bound to `showSimulatedMeasurements`) → vertical phase-indicator `Line` linked to `phaseProperty`. Update y-range + `setDataSet` when curve/amplitude change.
- `OrbitViewsNode.ts` — the four sub-views, extra ones gated on `showMultipleViewsProperty`:
  - **SideView** + **EarthView** + **2D OrbitView**: each a `Node` with its own `ModelViewTransform2` (AU `Bounds2` → square pixel `Bounds2`); star/planet `Circle`s positioned from `(a1,a2)` + current true anomaly; orbit ellipse as `Shape.ellipse` `Path`.
  - **3D OrbitView**: uses `Projection3D.ts` — a tilted grid plane + projected orbit ellipse + the two direction arrows (side "1" / earth "2"), rotating with phase. Built from `Path`/`Line`/`ArrowNode`.
- `RadialVelocityControlPanel.ts` — `ExtrasolarPlanetsPanel`+`VBox`: preset `ComboBox`, `NumberControl`s (planetMass, semimajorAxis, eccentricity, starMass, inclination, longitude, noise, number), 3 `Checkbox`es, `TimeControlNode(timer.isPlayingProperty, { timeSpeedProperty })`. Plus `StarPropertiesNode` + "system period: N days" readout.

**Transit:**
- `TransitVisualizationNode.ts` — black `Rectangle` with star disk `Circle` (radius via MVT) + grey planet `Circle` transiting along a horizontal line; planet x from `phaseProperty` through eclipse geometry, y offset from impact parameter (`cos i`).
- `TransitChartNode.ts` — same bamboo skeleton, `modelYRange ≈ [depth, 1.0]`; flux `LinePlot` + measurement `ScatterPlot` + phase indicator + an **eclipse-duration arrow** (`ArrowNode`/`Path` spanning `[startPhase,endPhase]` from `eclipseInterval`).
- `TransitControlPanel.ts` — preset `ComboBox` (11), `NumberControl`s (planetMass, planetRadius, starMass, semimajorAxis, eccentricity, inclination, longitude, phase, noise, number), 2 `Checkbox`es, `TimeControlNode`. Plus eclipse-depth readout, "eclipse takes X hours of Y day orbit" `PatternStringProperty`, and `StarPropertiesNode`.

### 4. Accessibility

- Rewrite each screen's `a11y.<screen>.screenSummary.{playArea,controlArea,interactionHint}` to describe the star–planet system, chart, and controls.
- Make `currentDetails` a **live `PatternStringProperty`** built in `*ScreenSummaryContent.ts` from the model (switch `_model`→`model`): RV → period/amplitude/spectral type; Transit → period/eclipse depth/duration/spectral type.
- `accessibleName` (+ `accessibleHelpText` where useful) on every `NumberControl`, `Checkbox`, the preset `ComboBox`, and `TimeControlNode` — sourced from new a11y string keys, never English literals.
- Keyboard help: extend `*KeyboardHelpContent` to pass left column `[SliderControlsKeyboardHelpSection, ComboBoxKeyboardHelpSection]`, right `[BasicActionsKeyboardHelpSection]` (verify exact class names in `scenerystack/scenery-phet`).

### 5. i18n (`strings_{en,es,fr}.json` — key parity is a hard compile gate)

Add the **same nested keys to all three files** (es/fr start as English copies). Per screen: `controls.*` (labels), `units.*` (`mJupiter, au, degrees, metersPerSecond, days, rJupiter`), `readouts.*` (`{{placeholder}}` patterns: `systemPeriodPattern`, `amplitudePattern`, `eclipseDepthPattern`, `eclipseDurationPattern`, `starTypePattern`), `presets.*` (7 / 11 names), `viewTitles.*` (RV), and richer `a11y.<screen>.controls.*` + `currentDetails` pattern. Add a typed getter in `StringManager.ts` exposing each screen's string subtree (e.g. `getRadialVelocityStrings()`).

### 6. Staging (keep `npm run check` + a running sim green at every milestone)

- **M0 — Shared core:** constants + `OrbitalMechanics`, `RandomUtils`, `StarProperties`, `Projection3D`, `EclipseGeometry` + their unit tests. Placeholders still render. Typechecks clean.
- **M1 (parallel):** both models' Properties + derived (period/amplitude/starProps; transit eclipse) + both control panels wired (NumberControls + checkboxes); remove placeholders; Reset works; readouts show.
- **M2:** both charts (theoretical `LinePlot` + axes + phase indicator).
- **M3:** measurements `ScatterPlot` + noise/number controls + curve/measurement checkboxes on both.
- **M4:** RV `OrbitViewsNode` (side/earth/2D orbit + **3D orbit** via `Projection3D`) and Transit `TransitVisualizationNode`; `TimeControlNode` animation; RV `showMultipleViews`.
- **M5:** preset `ComboBox`es, `StarPropertiesNode`, eclipse duration arrow + depth readout, live a11y `currentDetails`, keyboard-help sections — on both screens.

Each milestone adds Properties before any view references them and adds new strings to all three locales in the same change.

### 7. Testing (Vitest, mirror `tests/TimeModel.test.ts`)

`OrbitalMechanics.test.ts` (Kepler: 1 AU/1 M☉ ≈ 365.25 d; anomaly round-trips for e∈{0,0.2,0.5,0.8}; `kFactor`), `RandomUtils.test.ts` (deterministic `nextDouble` stub → polar-method mean/variance + reproducibility), `StarProperties.test.ts` (Sun → ~5800 K, ~1 R☉, ~G2V; M-dwarf; O7/M6 interp endpoints), `EclipseGeometry.test.ts` (overlap edge cases: 0 / π·min(r)² / clamps; flux≈1 outside eclipse; eclipse depth for a known preset within tolerance). Optional light model tests (defaults, `reset()`, `applyPreset` tuple).

### 8. Fidelity decisions to preserve (do NOT "improve")

`a1=(m2/m1)·a` approximation • per-screen `M_jup` differs (1.899e27 vs 1.8987e27) • ecc caps differ (0.8 vs 0.4) • uniform-disk flux, **no limb darkening** • planet temp fixed 500 K • normalized-flux = `visualFlux/maxVisualFlux` (factor `π`) with the `Z_occulted` body selection • **Marsaglia polar method** for the Gaussian (not trig Box–Muller) • RV measurement σ = noise slider value directly (the `0.1` `noMeasurementsNoise` is only the hidden-measurements plot margin) • Newton tolerance 1e-8 documented.

### Architectural risks / watch-items

- bamboo: `TickLabelSet` (not `LabelSet`); `Orientation` from `phet-core`.
- `ModelViewTransform2` from `phetcommon`; `ComboBox` needs top-level `listParent` + `createNode` items.
- `NumberProperty` `units` allow-list will assert on `MJupiter/MSun/RJupiter` — use `valuePattern`.
- **Log-scale sliders:** planetMass (0.001–100) and noise (0.00001–0.2) span decades but the Flash uses linear sliders → **keep linear for faithfulness**; revisit with a log `MappedProperty` only if UX demands.
- `findEclipseInterval` must degrade gracefully for non-transiting geometries (zero interval).
- Use one `Multilink` for measurement regeneration so randomness isn't re-rolled per-dependency.

## Verification

1. `npm run check` (tsc) clean and `npm test` (Vitest) green after every milestone — pure-physics tests are the primary correctness gate.
2. `npm run dev` (Vite) and exercise both screens in-browser: drag every slider, apply each preset, toggle theoretical/measurements/multiple-views, run the animation, confirm the moving phase indicator tracks the orbit.
3. **Faithfulness spot-checks vs the original** for known presets. Verified from the decompiled
   source: RV preset **Option A** (1 M☉, 1 M_jup, 1 AU) → period **365.07 d**; Transit preset
   **HD 209458 b** (sep 0.045 AU, 1.01 M☉ + 0.69 M_jup) → `systemPeriod` **≈ 3.47 d** (= √(4π²a³/GΣm)/86400).
   ⚠ The earlier "3.56 day" figure (from the reference screenshot) does **not** match this preset — a
   faithful port will display ~3.47 d for HD 209458 b, so target 3.47 d, not 3.56 d. Eclipse depth
   ≈ 0.0159 and duration ≈ 2.93 h are still to be confirmed once `EclipseGeometry` runs (depth ≈ (r2/r1)²
   gives ~0.014–0.016, in the right range). Cross-check against `NAAP/astroUNL/naap/esp/naap_esp_sg.pdf`
   and the deployed `astroUNL/naap/esp/animations/*.swf` if numbers diverge.
4. Accessibility: tab through every control (order matches `pdomOrder`), confirm screen-summary `currentDetails` updates live as parameters change, and the keyboard-help dialog lists slider + combo-box sections.
5. Optionally drive the running sim with the Playwright MCP browser tools for a screenshot diff against the two reference images (`NAAP/astroUNL/naap/esp/animations/radialVelocitySimulator.jpg` and `…/transitSimulator.jpg`).