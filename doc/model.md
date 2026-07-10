# Model - Extrasolar Planets

This document describes the model (the underlying physics, math, and behavior) for the simulation, in
terms appropriate for an educator. It is the companion to
[implementation-notes.md](./implementation-notes.md), which targets developers.

## Overview

This sim ports the NAAP *Extrasolar Planets* lab and has two screens that teach the two main
observational methods for detecting planets around other stars.

- **Radial Velocity** shows the Doppler “wobble”: a planet and its star orbit a shared center of mass,
  so the star’s line-of-sight velocity varies over the orbit. Students adjust masses, separation,
  eccentricity, inclination, and argument of periapsis, and compare a theoretical velocity curve with
  noisy simulated measurements.
- **Transit** shows the photometric dip when a planet crosses in front of its star. Students control
  planet radius as well as the orbital parameters, and see how depth and duration depend on geometry
  and stellar size. Again, a theoretical light curve can be compared with noisy simulated points.

Both screens use the same Keplerian two-body orbit and the same main-sequence mass → luminosity →
temperature → radius chain for the host star. Presets include pedagogical “Option” systems and named
exoplanets transcribed from the original Flash labs.

## Quantities and units

| Quantity | Symbol | Units | Range (approx.) |
|---|---|---|---|
| Star mass | M★ | solar masses (M☉) | RV 0.2–2; Transit 0.5–2 |
| Planet mass | Mp | Jupiter masses (MJup) | 0.001–100 |
| Planet radius (Transit) | Rp | Jupiter radii (RJup) | 0.01–2 |
| Semimajor axis | a | astronomical units (AU) | RV 0.01–10; Transit 0.015–2 |
| Eccentricity | e | — | RV 0–0.8; Transit 0–0.4 |
| Inclination | i | degrees | 0–180 (edge-on ≈ 90°) |
| Argument of periapsis | ω | degrees | 0–360 |
| Orbital period | P | days (derived) | from Kepler’s third law |
| RV semi-amplitude | K | m/s | derived |
| Normalized flux (Transit) | F | — (1 = out of transit) | ≤ 1 |
| Measurement noise | σ | m/s (RV) or flux (Transit) | slider-controlled |
| Orbital phase | φ | 0–1 (from periapsis) | animated |

Internal calculations use SI (m, kg, s); UI masses and distances use solar / Jupiter / AU units as above.

## Governing equations

### Keplerian two-body orbit

The relative orbit has semimajor axis *a*. Kepler’s third law gives the period:

```
P = √( 4π² a³ / (G (M★ + Mp)) )
```

Mean anomaly advances uniformly with phase. Eccentric anomaly *E* is solved from Kepler’s equation
`M = E − e sin E`, then converted to true anomaly *ν*. Positions and velocities follow from *ν*, *e*,
and *ω*.

### Radial velocity

The star’s orbit about the barycenter has semimajor axis *a₁ = a · Mp / (M★ + Mp)*. The
line-of-sight semi-amplitude is

```
K = (2π / P) · a₁ · sin i / √(1 − e²)
```

with systemic offset `v₀ = K · e · cos ω`. Instantaneous radial velocity:

```
v(ν) = K · cos(ω + ν) + v₀
```

### Transit light curve

Two uniform disks (star and planet) are projected on the sky. When they overlap, the occulted body’s
visual flux times the overlap area is removed from the total. Flux is normalized so out-of-transit
equals 1. There is **no limb darkening**. The planet is treated as a fixed 500 K blackbody for its
tiny contribution to the continuum. Transit depth and duration follow from the contact geometry
(inclination, radii, *a*, *e*, *ω*).

### Host star

Main-sequence (class V) properties are derived from stellar mass alone: luminosity from a broken
power law, temperature from a piecewise fit in log luminosity, radius from the Stefan–Boltzmann
relation, and spectral type from a temperature table — matching the NAAP Flash chain.

### Noise and measurements

Optional scatter points add Gaussian noise (σ from the noise slider) to the theoretical curve at
random phases, so students can see how measurement quality affects the visibility of the signal.

## Simplifications and assumptions

- Strict **two-body** Keplerian motion; no third bodies, tides, or stellar activity jitter.
- Host star is always **main-sequence**; evolution is not modeled on these screens.
- Transit disks are **uniform** (no limb darkening); planet temperature is fixed at 500 K.
- Inclination 0° is face-on (no RV signal / no transit); 90° is edge-on.
- Jupiter-mass conversion constants differ slightly between the two screens, preserving Flash fidelity.
- Presets set orbital parameters only — not noise, measurement count, or animation speed.

## References

- NAAP *Extrasolar Planets* lab (student guide and modeling pages under `NAAP/astroUNL/naap/`).
- Original Flash simulators: *Radial Velocity Simulator* (`radialVelocitySimulator`) and
  *Transit Simulator* (`transitSimulator`).
