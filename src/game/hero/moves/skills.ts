import { FEEL } from "../../../constants/combo";
import type { MoveDef } from "../../../types/move";
import { hero } from "../../state";
import { dust } from "../../world";

/** ground moves a skill puts in the string: Reaping Sweep opens it with the low sweep */
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
    afterHit: () => dust(hero.x + hero.face * 16, hero.y, 5, hero.face),
  },
} satisfies Record<string, MoveDef>;
