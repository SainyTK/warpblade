import { FEEL, PHANTOM_RAMP } from "../../../constants/combo";
import { PAL } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { createFloorRing } from "../../effects/floorRing";
import { game, hero } from "../../state";
import { dust } from "../../world";
import { PHANTOM_SWEEP, STAB, UPPERCUT } from "./slashes";

const RING = { cx: 0, cy: -11, R: 30, sy: 0.22, rot: 0, a0: -3.1, a1: 3.1, W: 6, sweep: 0.08 };

/** the stab pins the foe: a small ring and dust where the point meets it */
function pinImpact(): void {
  const gx = hero.x + hero.face * 16;
  game.fx.push(createFloorRing(gx, hero.y, 12, PAL.crystal, 0.2));
  dust(gx, hero.y, 3);
}

/** moves the foes around Kael ask for: one behind, foes on both sides, one lying down, one in the air */
export const SITUATIONAL_MOVES = {
  turnCut: {
    id: "turnCut",
    turns: true,
    name: "Turning cut",
    clip: "pivot",
    pitch: 1.05,
    hits: [{ at: 0.08, box: [-4, -40, 30, -2], power: 1.2, kx: 60, ky: -30, slash: PHANTOM_SWEEP, feel: FEEL.firm }],
  },
  ringCut: {
    id: "ringCut",
    name: "Ring cut",
    clip: "ring",
    pitch: 0.95,
    hits: [
      { at: 0.06, box: [-4, -30, 30, 2], power: 0.8, kx: 40, ky: -20, around: true, slash: RING, feel: FEEL.light },
      {
        at: 0.15,
        box: [-4, -30, 30, 2],
        power: 0.8,
        kx: 60,
        ky: -30,
        around: true,
        slash: { ...RING, cy: -14, R: 26, a0: 3.1, a1: -3.1, ramp: PHANTOM_RAMP },
        feel: { ...FEEL.light, pitch: 0.9 },
      },
    ],
  },
  downStab: {
    id: "downStab",
    name: "Pinning stab",
    clip: "downStab",
    pitch: 1.2,
    hits: [
      {
        at: 0.13,
        box: [0, -18, 30, 2],
        power: 1,
        kx: 0,
        ky: 0,
        slash: { ...STAB, cx: 12, cy: -16, R: 16, rot: 1.45, W: 5 },
        feel: { stop: 0.09, shake: [0.1, 1.5], pitch: 0.75 },
      },
    ],
    enter: () => {
      hero.stabbed = true;
    },
    afterHit: pinImpact,
  },
  chaseCut: {
    id: "chaseCut",
    name: "Chase cut",
    clip: "chase",
    falls: true,
    pitch: 1.2,
    ghosts: 0.15,
    hits: [
      {
        at: 0.08,
        box: [-4, -64, 30, -14],
        power: 1.1,
        kx: 30,
        ky: 0,
        slash: { ...UPPERCUT, cy: -30, R: 24 },
        feel: FEEL.light,
      },
    ],
    lift: 57,
  },
} satisfies Record<string, MoveDef>;
