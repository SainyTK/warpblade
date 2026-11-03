import { ADVANCE, FEEL } from "../../../constants/combo";
import type { MoveDef } from "../../../types/move";
import { hero } from "../../state";
import { dust } from "../../world";
import { nearestGapAhead } from "../situation";
import { THRUST_SLASH, UPPERCUT } from "./slashes";

/** ground moves a skill unlocks: Down for the sweep, Up for the launcher, a run for the thrust */
export const SKILL_MOVES = {
  sweep: {
    id: "sweep",
    name: "Low sweep",
    clip: "sweep",
    pitch: 0.9,
    hits: [
      {
        at: 0.1,
        box: [-2, -16, 34, 2],
        power: 1,
        kx: -150,
        ky: 0,
        stun: 0.9,
        slash: { cx: 6, cy: -6, R: 22, sy: 0.3, rot: 0.05, a0: -2.8, a1: 0.6, W: 6 },
        feel: FEEL.firm,
      },
    ],
    strides: [{ from: 0.03, to: 0.14, speed: 300 }],
    afterHit: () => dust(hero.x + hero.face * 16, hero.y, 5, hero.face),
  },
  launcher: {
    id: "launcher",
    name: "Rising launcher",
    clip: "uppercut",
    pitch: 0.8,
    hits: [
      {
        at: 0.1,
        box: [-4, -50, 28, 0],
        power: 1.3,
        kx: 20,
        ky: 0,
        launch: -330,
        big: true,
        slash: UPPERCUT,
        feel: FEEL.heavy,
      },
    ],
    cancel: 0.05,
    strides: [{ from: 0, to: 0.07, speed: 140 }],
  },
  thrust: {
    id: "thrust",
    name: "Running thrust",
    clip: "thrust",
    pitch: 1.1,
    ghosts: 0.16,
    hits: [
      {
        at: 0.12,
        box: [0, -30, 38, -6],
        power: 1.6,
        kx: 380,
        ky: -50,
        big: true,
        wall: true,
        slash: { ...THRUST_SLASH, R: 26, W: 7 },
        feel: FEEL.heavy,
      },
    ],
    // a lunge that slides on after the blow, but never into the foe
    step: (t) => {
      const lunging = t < 0.18 && nearestGapAhead() > ADVANCE.contact;
      hero.vx = lunging ? hero.face * 260 : hero.vx * 0.9;
    },
  },
} satisfies Record<string, MoveDef>;
