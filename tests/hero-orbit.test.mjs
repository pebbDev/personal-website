import assert from "node:assert/strict";
import test from "node:test";
import { getOrbitCardState, getOrbitLayout } from "../src/features/home/components/orbit-geometry.ts";
import { orbitCards } from "../src/features/home/constants.ts";

function closeTo(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${actual} to be close to ${expected}`);
}

// Literal fixtures catch incorrect breakpoint inclusivity, centers and radius clamps.
for (const [width, cardSize, radiusX, radiusY] of [
  [390, 96, 257.4, 257.4],
  [639, 96, 421.74, 328],
  [640, 120, 400, 334],
  [900, 120, 405, 334],
  [999, 120, 449.55, 334],
  [1000, 140, 450, 339],
  [1440, 140, 600, 339],
]) {
  test(`layout at width ${width} preserves source sizing and copy center`, () => {
    const layout = getOrbitLayout(width, 400);
    assert.equal(layout.centerX, width / 2);
    assert.equal(layout.centerY, 400);
    assert.equal(layout.cardSize, cardSize);
    closeTo(layout.radiusX, radiusX);
    closeTo(layout.radiusY, radiusY);
  });
}

test("radii keep the mobile minimum and follow a lower or higher copy center", () => {
  assert.deepEqual(getOrbitLayout(300, 200), {
    centerX: 150,
    centerY: 200,
    cardSize: 96,
    radiusX: 250,
    radiusY: 220,
  });
  assert.equal(getOrbitLayout(1000, 1000).radiusY, 450);
});

const layout = { centerX: 720, centerY: 400, cardSize: 140, radiusX: 600, radiusY: 339 };

test("sixteen cards occupy distinct 22.5 degree slots with source rotation", () => {
  const rotations = [0, 6.3, 12.6, 18.9, 25.2, 31.5, 37.8, 44.1, -50.4, -44.1, -37.8, -31.5, -25.2, -18.9, -12.6, -6.3];
  const states = orbitCards.map((_, index) => getOrbitCardState(index, orbitCards.length, 0, layout));
  assert.equal(states.length, 16);
  assert.equal(new Set(states.map(({ x, y }) => `${x},${y}`)).size, 16);
  states.forEach((state, index) => closeTo(state.rotation, rotations[index]));
});

test("card positions align around both center axes using the 360:389 crop", () => {
  for (const [index, x, y] of [
    [0, 650, -14.63888888888889],
    [4, 1250, 324.3611111111111],
    [8, 650, 663.3611111111111],
    [12, 50, 324.3611111111111],
  ]) {
    const state = getOrbitCardState(index, 16, 0, layout);
    closeTo(state.x, x);
    closeTo(state.y, y);
  }
});

test("card count determines the angular spacing", () => {
  assert.deepEqual(getOrbitCardState(1, 4, 0, layout), getOrbitCardState(4, 16, 0, layout));
});

test("positive and negative phases wrap across multiple revolutions", () => {
  for (const phase of [22.5, -22.5, 180, -180]) {
    const expected = getOrbitCardState(3, 16, phase, layout);
    for (const turn of [-1080, -360, 360, 1080]) {
      assert.deepEqual(getOrbitCardState(3, 16, phase + turn, layout), expected);
    }
  }
  assert.deepEqual(getOrbitCardState(0, 16, 180, layout), getOrbitCardState(0, 16, -180, layout));
});

test("front stays opaque and back fades symmetrically to hidden", () => {
  for (const [phase, opacity, visible] of [
    [0, 1, true],
    [90, 1, true],
    [115, 1, true],
    [132.5, 0.5, true],
    [149.2965, 0.0201, true],
    [149.3035, 0.0199, false],
    [150, 0, false],
    [180, 0, false],
  ]) {
    for (const direction of [-1, 1]) {
      const state = getOrbitCardState(0, 16, phase * direction, layout);
      closeTo(state.opacity, opacity);
      assert.equal(state.visible, visible);
      assert.ok(state.opacity >= 0 && state.opacity <= 1);
    }
  }
});

test("card fixtures have sixteen unique stable IDs and generic labels without media or destinations", () => {
  assert.equal(orbitCards.length, 16);
  assert.equal(new Set(orbitCards.map(({ id }) => id)).size, 16);
  orbitCards.forEach((card, index) => {
    const number = String(index + 1).padStart(2, "0");
    assert.deepEqual(card, { id: `project-study-${number}`, label: `Project study ${number}` });
  });
});
