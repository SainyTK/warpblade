import { PAL, WORLD_COLORS } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { game, hero, particles, rng } from "../../state";
import { dust, shake } from "../../world";

const CROSS = { cx: 4, cy: -21, R: 21, sy: 0.62, rot: -0.35, a0: -2.5, a1: 0.95, W: 8 };
const RISING = { cx: 6, cy: -20, R: 20, sy: 0.7, rot: 0.25, a0: 1.4, a1: -1.9, W: 7 };
export const THRUST_SLASH = { cx: 10, cy: -18, R: 20, sy: 0.16, rot: 0, a0: -2.6, a1: 0.25, W: 5 };
const SPIN_NEAR = { cx: 0, cy: -18, R: 26, sy: 0.3, rot: 0, a0: 3.0, a1: 0, W: 7 };
const SPIN_FAR = { ...SPIN_NEAR, a0: 0, a1: -3.0 };
export const UPPERCUT = { cx: 5, cy: -22, R: 22, sy: 0.75, rot: 0.3, a0: 1.6, a1: -1.7, W: 8 };

/** the wide crescent with an echo, and on the floor a ring, dust and rubble */
function smashImpact(): void {
  const shape = { cx: 6, cy: -22, sy: 0.55, rot: -0.15 };
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      ...shape,
      R: 21,
      a0: -2.0,
      a1: 1.15,
      W: 5,
      t0: 0.017,
      sweep: 0.06,
      hold: 0.03,
      trail: 0.2,
      ramp: PAL.crystal.slice(0, 6),
    }),
  );
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 22;
  game.fx.push(createFloorRing(gx, hero.y, 30, PAL.crystal, 0.35));
  dust(gx, hero.y, 7, hero.face);
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * rng.range(20, 120),
      rng.range(-180, -60),
      rng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.2, 2);
}

/** the ground string: light cuts in order, and the falling smash to finish */
export const GROUND_MOVES = {
  cut1: {
    id: "cut1",
    name: "Cross cut",
    clip: "atk1",
    hits: [{ at: 0.09, box: [-2, -38, 30, -2], power: 1.2, kx: 90, ky: -30, slash: CROSS }],
  },
  cut2: {
    id: "cut2",
    name: "Backhand",
    clip: "atk2",
    hits: [{ at: 0.09, box: [-4, -46, 26, -4], power: 1.2, kx: 50, ky: -60, slash: RISING }],
  },
  cut3: {
    id: "cut3",
    name: "Thrust",
    clip: "thrust",
    hits: [{ at: 0.08, box: [0, -28, 34, -10], power: 1.3, kx: 120, ky: -20, slash: THRUST_SLASH }],
    enter: () => {
      hero.vx = hero.face * 90;
    },
  },
  cut4: {
    id: "cut4",
    name: "Turning cut",
    clip: "spin",
    hits: [
      { at: 0.06, box: [-4, -36, 28, -2], power: 0.8, kx: 60, ky: -30, around: true, slash: SPIN_NEAR },
      { at: 0.14, box: [-4, -36, 28, -2], power: 0.8, kx: 60, ky: -30, around: true, slash: SPIN_FAR },
    ],
  },
  cut5: {
    id: "cut5",
    name: "Twin cut",
    clip: "atk1",
    hits: [{ at: 0.09, box: [-2, -40, 32, 0], power: 1.4, kx: 110, ky: -40, slash: { ...CROSS, R: 24, W: 10 } }],
  },
  smash: {
    id: "smash",
    name: "Falling smash",
    clip: "atk3",
    hits: [
      {
        at: 0.16,
        box: [-2, -40, 38, 2],
        power: 2.2,
        kx: 220,
        ky: -60,
        big: true,
        slash: {
          cx: 6,
          cy: -22,
          sy: 0.55,
          rot: -0.15,
          R: 27,
          a0: -2.3,
          a1: 1.25,
          W: 12,
          sweep: 0.06,
          hold: 0.07,
          trail: 0.28,
        },
      },
    ],
    step: (t) => {
      if (t > 0.1 && t < 0.17) hero.vx = hero.face * 150;
    },
    afterHit: smashImpact,
  },
  sweep: {
    id: "sweep",
    name: "Low sweep",
    clip: "sweep",
    hits: [
      {
        at: 0.1,
        box: [-2, -16, 34, 2],
        power: 1,
        kx: -150,
        ky: 0,
        stun: 0.9,
        slash: { cx: 6, cy: -6, R: 22, sy: 0.3, rot: 0.05, a0: -2.8, a1: 0.6, W: 6 },
      },
    ],
    afterHit: () => dust(hero.x + hero.face * 16, hero.y, 5, hero.face),
  },
  launcher: {
    id: "launcher",
    name: "Rising launcher",
    clip: "uppercut",
    hits: [{ at: 0.1, box: [-4, -50, 28, 0], power: 1.3, kx: 20, ky: 0, launch: -330, big: true, slash: UPPERCUT }],
  },
  thrust: {
    id: "thrust",
    name: "Running thrust",
    clip: "thrust",
    hits: [
      {
        at: 0.08,
        box: [0, -30, 38, -6],
        power: 1.6,
        kx: 380,
        ky: -50,
        big: true,
        slash: { ...THRUST_SLASH, R: 26, W: 7 },
      },
    ],
    step: (t) => {
      if (t < 0.16) hero.vx = hero.face * 260;
    },
  },
} satisfies Record<string, MoveDef>;
