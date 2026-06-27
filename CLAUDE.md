# CLAUDE.md — Extrasolar Planets

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

A two-screen SceneryStack simulation about detecting extrasolar planets, scaffolded
from `TemplateSingleSim`:

- **Radial Velocity** (`src/radial-velocity/`) — the radial-velocity (Doppler wobble) method.
- **Transit** (`src/transit/`) — the transit (light-curve dip) method.

Both screens are currently empty scaffolding (a placeholder label + Reset All).
Shared code keeps the `ExtrasolarPlanets` prefix; per-screen code uses the
`RadialVelocity` / `Transit` prefixes. See `doc/multi-screen.md`.

## Key files

| File | Purpose |
|---|---|
| `src/ExtrasolarPlanetsColors.ts` | All `ProfileColorProperty` instances (shared) |
| `src/ExtrasolarPlanetsConstants.ts` | Named numeric constants (layout px, physics SI units) |
| `src/ExtrasolarPlanetsNamespace.ts` | Namespace for color property names |
| `src/i18n/StringManager.ts` | Singleton localized string accessor; per-screen name + a11y getters |
| `src/<screen>/<Screen>Screen.ts` | Per-screen `Screen<Model, View>` wrapper |
| `src/<screen>/model/<Screen>Model.ts` | Per-screen simulation state and logic |
| `src/<screen>/view/<Screen>ScreenView.ts` | Visual nodes, layout, `screenSummaryContent` + `pdomOrder` |
| `src/<screen>/view/<Screen>ScreenSummaryContent.ts` | Accessible screen summary (reference a11y pattern) |
| `src/<screen>/view/<Screen>KeyboardHelpContent.ts` | Keyboard-help dialog content |
| `src/common/ExtrasolarPlanetsPanel.ts` | Pre-themed `Panel` wrapper (uses `ExtrasolarPlanetsColors` automatically) |
| `src/common/TimeModel.ts` | Composable play/pause + elapsed-time model for animated sims |
| `scripts/generate-icons.ts` | PNG icons from `public/icons/icon.svg` |
| `scripts/rename-sim.ts` | Automated fork/rename across all files and folders |

`<screen>` is one of `radial-velocity`, `transit`, with class prefixes
`RadialVelocity`, `Transit`.

## Common components

### ExtrasolarPlanetsPanel

Every control panel and info box in the sim should use `ExtrasolarPlanetsPanel` so that
default/projector color switching is automatic:

```typescript
import { ExtrasolarPlanetsPanel } from "../../common/ExtrasolarPlanetsPanel.js";
const panel = new ExtrasolarPlanetsPanel(content);              // uses ExtrasolarPlanetsColors defaults
const panel = new ExtrasolarPlanetsPanel(content, { xMargin: 20 }); // override any PanelOption
```

### TimeModel

For simulations with animation, compose `TimeModel` into your screen model:

```typescript
import { TimeModel } from "../../common/TimeModel.js";

export class FrictionModel implements TModel {
  public readonly timer = new TimeModel();   // starts paused; pass true to auto-play

  public step(dt: number): void {
    this.timer.step(dt);
    // use this.timer.timeProperty.value for physics
  }
  public reset(): void { this.timer.reset(); /* … */ }
}
```

Wire the view to `TimeControlNode` from `scenerystack/scenery-phet` binding on
`model.timer.isPlayingProperty`.

## Accessibility

Each screen registers its own `*ScreenSummaryContent` and an explicit `pdomOrder` +
`*KeyboardHelpContent`. A11y strings live under per-screen keys in the `a11y` block of
each locale JSON (`a11y.radialVelocity`, `a11y.transit`), exposed via
`StringManager.getRadialVelocityA11yStrings()` / `getTransitA11yStrings()`. When building
out a real sim, make each `currentDetailsContent` a live `DerivedProperty` over model
state and add `accessibleName`s to every interactive node. Full convention and checklist:
[../Baton/ACCESSIBILITY.md](../Baton/ACCESSIBILITY.md).

## Customizing a new sim from this template

### Automated rename (recommended)

```sh
npm run rename -- --id friction --name "Friction"
# or for multi-word names:
npm run rename -- --id wave-interference --name "Wave Interference"
```

This replaces all template identifiers in file contents and renames files/folders. Run `npm run check` afterwards to verify TypeScript is clean.

### Manual checklist (if not using the rename script)

1. **Rename** — replace `extrasolar-planets` / `Extrasolar Planets` / `Sim` prefix in `init.ts`, `brand.ts`, `package.json`, class names, and screen folders
2. **Locale** — add `strings_XX.json`, register in `StringManager`, add locale to `init.ts` `availableLocales`
3. **Icon** — edit `public/icons/icon.svg`, run `npm run icons`; match theme color in `index.html` / `vite.config.ts`
4. **Colors** — edit `ExtrasolarPlanetsColors.ts` (`default` + `projector` profiles per property)

## Multi-screen sims

Full guide: **`doc/multi-screen.md`**

Summary:
- Create a new screen folder mirroring `src/radial-velocity/` (or `src/transit/`) for each screen
- Add screen-name keys to all locale JSON files
- Expose new `StringProperty` getters in `StringManager.getScreenNames()`
- For shared state, create a root model passed to each per-screen model
- Register all screens in the `screens` array in `main.ts`

## Using this template beyond a direct copy

| Approach | When to use |
|---|---|
| **GitHub template** ("Use this template" button) | Starting a single new sim |
| `npm run rename` after cloning | Same, automated |
| **npm workspace / monorepo** | Managing a suite of sims with shared tooling |
| **`npm create` scaffolder** | Org-wide standardized sim bootstrapping |
| **git subtree** for pulling updates | Keeping forks in sync with template improvements |

See `doc/multi-screen.md` → "Using this template beyond a direct copy" for details on each approach.

## PWA

After `npm run build`, the sim is installable offline via Workbox (`dist/manifest.webmanifest`).
