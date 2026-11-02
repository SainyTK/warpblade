import { ENEMY_AIR } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { game, hero } from "../../state";
import { boxAhead, dust, shake } from "../../world";
import { gravityPull } from "../gravityWell";

const AIR_CROSS = { cx: 4, cy: -21, R: 21, sy: 0.62, rot: -0.35, a0: -2.5, a1: 0.95, W: 8 };
const AIR_RISING = { cx: 6, cy: -20, R: 20, sy: 0.7, rot: 0.25, a0: 1.4, a1: -1.9, W: 7 };
const WHIRL = { cx: 0, cy: -18, R: 25, sy: 0.85, rot: 0, a0: -1.6, a1: 1.5, W: 7 };
const METEOR_REACH = 46;

/** the plunge lands: a ring of crystal, dust, and everything near the floor bounced up */
function meteorLanding(): void {
  game.swing++;
  game.fx.push(createFloorRing(hero.x, hero.y, METEOR_REACH, PAL.crystal, 0.45));
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 0, cy: -4, R: 30, sy: 0.25, rot: 0, a0: 3.1, a1: 0, W: 7 }),
  );
  dust(hero.x - 8, hero.y, 6, -1);
  dust(hero.x + 8, hero.y, 6, 1);
  shake(0.25, 3);
  meleeHit([boxAhead(-METEOR_REACH, -26, METEOR_REACH, 4)], { power: 1.8, kx: 60, ky: 0, launch: -240, big: true });
  gravityPull();
}

/** the air string: two cuts that keep foes up, then the spike that drives them into the floor */
export const AIR_MOVES = {
  airCut1: {
    id: "airCut1",
    name: "Air cut",
    clip: "atk1",
    hits: [{ at: 0.09, box: [-4, -40, 30, 6], power: 1.1, kx: 50, ky: -20, slash: AIR_CROSS }],
  },
  airCut2: {
    id: "airCut2",
    name: "Air backhand",
    clip: "atk2",
    hits: [{ at: 0.09, box: [-4, -46, 28, 2], power: 1.1, kx: 40, ky: -40, slash: AIR_RISING }],
  },
  airSpike: {
    id: "airSpike",
    name: "Air spike",
    clip: "atk3",
    hits: [
      {
        at: 0.16,
        box: [-4, -40, 36, 8],
        power: 2,
        kx: 90,
        ky: ENEMY_AIR.spike,
        spike: true,
        big: true,
        slash: { cx: 6, cy: -20, R: 25, sy: 0.6, rot: 0.6, a0: -2.2, a1: 1.3, W: 10, hold: 0.06, trail: 0.26 },
      },
    ],
    afterHit: gravityPull,
  },
  whirl: {
    id: "whirl",
    name: "Whirlwind",
    clip: "spin",
    hits: [
      { at: 0.06, box: [-4, -42, 28, 6], power: 0.7, kx: 30, ky: 0, launch: -150, around: true, slash: WHIRL },
      {
        at: 0.14,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -150,
        around: true,
        slash: { ...WHIRL, a0: 1.5, a1: 4.6 },
      },
      { at: 0.22, box: [-4, -42, 28, 6], power: 0.7, kx: 30, ky: 0, launch: -170, around: true, slash: WHIRL },
    ],
    enter: () => {
      hero.whirled = true;
      hero.vy = -90;
    },
  },
  meteor: {
    id: "meteor",
    name: "Meteor drop",
    clip: "plunge",
    hits: [],
    guard: 9,
    untilLanding: true,
    falls: true,
    enter: () => {
      hero.vy = -60;
      hero.vx = hero.face * 30;
    },
    step: (t) => {
      if (t > 0.1) hero.vy = 460;
    },
    land: meteorLanding,
  },
} satisfies Record<string, MoveDef>;
