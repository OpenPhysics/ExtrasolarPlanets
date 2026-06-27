/**
 * Projection3D.test.ts
 *
 * Sanity-checks the rotation/projection primitives and the orbital-plane
 * position used by the RV 3-D orbit view.
 */

import { Vector3 } from "scenerystack/dot";
import { describe, expect, it } from "vitest";
import { orbitalPlanePosition, projectToScreen, rotateX, rotateY, rotateZ } from "../src/common/Projection3D.js";

const HALF_PI: number = Math.PI / 2;

function expectVector3(actual: Vector3, x: number, y: number, z: number): void {
  expect(actual.x).toBeCloseTo(x, 10);
  expect(actual.y).toBeCloseTo(y, 10);
  expect(actual.z).toBeCloseTo(z, 10);
}

describe("rotations (right-handed, 90°)", () => {
  it("rotateZ sends +x to +y", () => {
    expectVector3(rotateZ(new Vector3(1, 0, 0), HALF_PI), 0, 1, 0);
  });

  it("rotateX sends +y to +z", () => {
    expectVector3(rotateX(new Vector3(0, 1, 0), HALF_PI), 0, 0, 1);
  });

  it("rotateY sends +z to +x", () => {
    expectVector3(rotateY(new Vector3(0, 0, 1), HALF_PI), 1, 0, 0);
  });

  it("preserves vector length", () => {
    const v = new Vector3(3, -4, 12); // magnitude 13
    expect(rotateX(v, 0.7).magnitude).toBeCloseTo(13, 9);
    expect(rotateZ(v, -2.1).magnitude).toBeCloseTo(13, 9);
  });
});

describe("orbitalPlanePosition", () => {
  it("places periapsis (ν=0) at distance a(1−e) and apoapsis (ν=π) at a(1+e)", () => {
    const a = 5;
    const e = 0.3;
    expect(orbitalPlanePosition(0, a, e).magnitude).toBeCloseTo(a * (1 - e), 9);
    expect(orbitalPlanePosition(Math.PI, a, e).magnitude).toBeCloseTo(a * (1 + e), 9);
  });

  it("stays in the z=0 plane", () => {
    for (let i = 0; i < 8; i++) {
      expect(orbitalPlanePosition((i / 8) * 2 * Math.PI, 2, 0.5, 1.1).z).toBe(0);
    }
  });

  it("rotates periapsis by the argument of periapsis", () => {
    const p = orbitalPlanePosition(0, 4, 0, HALF_PI); // ω = 90°, circular
    expectVector3(p, 0, 4, 0);
  });
});

describe("projectToScreen", () => {
  it("is the (x,y) identity for a head-on camera", () => {
    const screen = projectToScreen(new Vector3(2, -3, 9), { thetaRad: 0, phiRad: 0 });
    expect(screen.x).toBeCloseTo(2, 10);
    expect(screen.y).toBeCloseTo(-3, 10);
  });

  it("tilting elevation foreshortens the y-extent", () => {
    const flat = projectToScreen(new Vector3(0, 1, 0), { thetaRad: 0, phiRad: 0 });
    const tilted = projectToScreen(new Vector3(0, 1, 0), { thetaRad: HALF_PI / 2, phiRad: 0 });
    expect(Math.abs(tilted.y)).toBeLessThan(Math.abs(flat.y));
  });
});
