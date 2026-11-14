import { ENEMY_AIR } from "../../../../constants/combat";
import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createSlash } from "../../../../game/effects/slash";
import { skin } from "../../../../game/hero/skin";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { meleeHit } from "../../../../game/meleeHit";
import { game, hero } from "../../../../game/state";
import { boxAhead, dust, newSwing, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { AIR_CANCEL, NIGHTFALL, STRING_FEEL } from "../../constants/string";
import { tellLaunched } from "../launched";
import { nightfallLanded } from "../skills/airSkills";
import { takeStruck } from "../struck";
import { DIVE_A, DIVE_B, SWOOP, UNDERCUT, WHEEL_LONG, WHEEL_SHORT } from "./slashes";

/** the dive leaves its tuck on this frame */
const TUCK = frame(5);
/** the floor crescent of the dive's landing */
const FLOOR_CUT = { cx: 0, cy: -4, R: 28, sy: 0.25, rot: 0, a0: 3.1, a1: 0, W: 6 } as const;

/** the nightfall lands: both blades cut the floor on each side, a ring of dusk and dust, and foes near it knocked down */
function landDive(): void {
  newSwing();
  const reach = NIGHTFALL.reach;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, FLOOR_CUT));
  game.fx.push(createFloorRing(hero.x, hero.y, reach, skin.ramp, 0.4));
  dust(hero.x - 6, hero.y, 6, -1);
  dust(hero.x + 6, hero.y, 6, 1);
  shake(0.2, 2.5);
  meleeHit([boxAhead(-reach, -24, reach, 4)], {
    power: 1.2,
    kx: 90,
    ky: -50,
    stun: 0.6,
    big: true,
    feel: STRING_FEEL.dive,
  });
  nightfallLanded(takeStruck());
  travelEnded();
}

/**
 * The air string, four presses before she lands: a long-blade swoop, a short-blade undercut that pops the foe up, a wheel
 * of both blades, and the nightfall, a dive with both blades crossed that spikes what is under her and cuts the floor on
 * both sides when she lands. Air blows hang her in the air once she stops rising, so the string keeps the foe beside her.
 */
export const AIR_MOVES = {
  swallowCut: {
    id: "swallowCut",
    name: "Swallow cut",
    clip: "swallowCut",
    pitch: 1.15,
    cancel: AIR_CANCEL,
    hits: [
      { at: onFrame(4), box: [-6, -44, 30, 10], power: 0.9, kx: 20, ky: -40, slash: SWOOP, feel: STRING_FEEL.long },
    ],
  },
  wingCut: {
    id: "wingCut",
    name: "Wing cut",
    clip: "wingCut",
    pitch: 1.35,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(4),
        box: [-6, -40, 26, 12],
        power: 0.8,
        kx: 20,
        ky: -120,
        slash: UNDERCUT,
        feel: STRING_FEEL.short,
      },
    ],
  },
  twinWheel: {
    id: "twinWheel",
    name: "Twin wheel",
    clip: "twinWheel",
    pitch: 1.2,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(4),
        box: [-6, -44, 30, 8],
        power: 0.65,
        kx: 15,
        ky: -30,
        slash: WHEEL_LONG,
        feel: STRING_FEEL.long,
      },
      {
        at: onFrame(7),
        box: [-6, -36, 26, 12],
        power: 0.6,
        kx: 15,
        ky: -60,
        launch: -170,
        slash: WHEEL_SHORT,
        feel: STRING_FEEL.short,
      },
    ],
    afterHit: (hits) => {
      if (hits > 0) tellLaunched(36);
    },
  },
  nightfall: {
    id: "nightfall",
    name: "Nightfall",
    clip: "nightfall",
    pitch: 0.7,
    falls: true,
    untilLanding: true,
    hits: [
      {
        at: onFrame(5),
        box: [-8, -26, 24, 14],
        power: 1.0,
        kx: 20,
        ky: ENEMY_AIR.spike,
        spike: true,
        slash: DIVE_A,
        feel: STRING_FEEL.long,
      },
    ],
    afterHit: () => {
      game.fx.push(createSlash(hero.x, hero.y, hero.face, DIVE_B));
    },
    step: (t) => {
      hero.vx = hero.face * 40;
      hero.vy = t < TUCK ? Math.min(hero.vy, -30) : NIGHTFALL.dive;
    },
    land: landDive,
  },
} satisfies Record<string, MoveDef>;
