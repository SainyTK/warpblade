import { ENEMY_AIR } from "../../../../constants/combat";
import { onFrame } from "../../../../constants/combo";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { game, hero } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { AIR_CANCEL, DROP_FALL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { dropLanded } from "../skills/blastJump";
import { SLASHES } from "./slashes";

/** seconds into Drop cut before it dives: the wind-up hangs, then the fall */
const DIVE_FROM = onFrame(5);

/** Drop cut meets the floor: a small ring and dust, and Blast Jump's blast when held */
function dropLanding(): void {
  game.fx.push(createFloorRing(hero.x + hero.face * 8, hero.y, 18, skin.ramp, 0.25));
  dust(hero.x, hero.y, 5);
  shake(0.12, 1.6);
  dropLanded();
}

/** the air string: Air hew, a flat cut, then Drop cut, which dives to the floor and drives foes under it down */
export const AIR_MOVES = {
  airHew: {
    id: "airHew",
    name: "Air hew",
    clip: "airHew",
    pitch: 1,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -42, 32, 4],
        power: STRING_POWER.airHew,
        kx: 20,
        ky: -60,
        slash: SLASHES.airHew,
        feel: STRING_FEEL.airHew,
      },
    ],
  },
  dropCut: {
    id: "dropCut",
    name: "Drop cut",
    clip: "dropCut",
    pitch: 0.8,
    falls: true,
    untilLanding: true,
    hits: [
      {
        at: onFrame(5),
        box: [-6, -30, 30, 16],
        power: STRING_POWER.dropCut,
        kx: 20,
        ky: ENEMY_AIR.spike,
        spike: true,
        slash: SLASHES.dropCut,
        feel: STRING_FEEL.dropCut,
      },
    ],
    step: (t) => {
      hero.vx = 0;
      hero.vy = t < DIVE_FROM ? Math.min(hero.vy, 0) : DROP_FALL;
    },
    land: dropLanding,
  },
} satisfies Record<string, MoveDef>;
