import { ENEMY_AIR } from "../../../../constants/combat";
import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { meleeHit } from "../../../../game/meleeHit";
import { skillValues } from "../../../../game/skills/query";
import { game, hero } from "../../../../game/state";
import { boxAhead, boxBehind, dust, newSwing, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import {
  AIR_CANCEL,
  BASH_STAGGER,
  BLOW_POWER,
  CREST_STUN,
  SHIELD_FALL,
  STRING_CANCEL,
  STRING_FEEL,
} from "../../constants/kit";
import type { AldricMoveId } from "../../types/moves";
import { CREST, OATH, SKY } from "./slashes";

/** Crest breaker meets the floor: a ring, dust and a jolt */
function crestImpact(): void {
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 18;
  game.fx.push(createFloorRing(gx, hero.y, 22, skin.ramp, 0.3));
  dust(gx, hero.y, 5, hero.face);
}

/** Shield fall lands: a ring of light where the shield strikes the floor knocks every foe near off its feet */
function fallLanding(): void {
  const ring = SHIELD_FALL.ring * (1 + (skillValues("al_skyfall").ring ?? 0));
  game.fx.push(createFloorRing(hero.x, hero.y, ring, skin.ramp, 0.4));
  dust(hero.x, hero.y, 8);
  shake(0.18, 2.2);
  newSwing();
  const box: [number, number, number, number] = [-ring * 0.3, -18, ring, 4];
  meleeHit([boxAhead(...box), boxBehind(...box)], {
    power: SHIELD_FALL.power * (skillValues("al_skyfall").power ?? 1),
    kx: 60,
    ky: -60,
    stun: SHIELD_FALL.stun,
    big: true,
  });
  travelEnded();
}

/**
 * Aldric's moves: the ground string (Oath cut, Shield bash, Crest breaker) and the air string (Sky cut, Shield fall).
 * The string is the same every time; his skills reshape its blows in the kit's `shapeHit`.
 */
export const ALDRIC_MOVES = {
  oathCut: {
    id: "oathCut",
    name: "Oath cut",
    clip: "oathCut",
    pitch: 1,
    cancel: STRING_CANCEL.oathCut,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -38, 31, -2],
        power: BLOW_POWER.oathCut,
        kx: 10,
        ky: -20,
        slash: OATH,
        feel: STRING_FEEL.oathCut,
      },
    ],
  },
  shieldBash: {
    id: "shieldBash",
    name: "Shield bash",
    clip: "shieldBash",
    pitch: 0.8,
    cancel: STRING_CANCEL.shieldBash,
    hits: [
      {
        at: onFrame(5),
        box: [0, -36, 27, 0],
        power: BLOW_POWER.shieldBash,
        kx: 14,
        ky: -10,
        stagger: BASH_STAGGER,
        big: true,
        feel: STRING_FEEL.shieldBash,
      },
    ],
  },
  crestBreaker: {
    id: "crestBreaker",
    name: "Crest breaker",
    clip: "crestBreaker",
    pitch: 0.7,
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(7),
        box: [-2, -42, 36, 2],
        power: BLOW_POWER.crestBreaker,
        kx: 60,
        ky: -60,
        stun: CREST_STUN,
        big: true,
        wall: true,
        slash: CREST,
        feel: STRING_FEEL.crestBreaker,
      },
    ],
    strides: [{ from: frame(3), to: frame(7), speed: 160 }],
    afterHit: crestImpact,
  },
  skyCut: {
    id: "skyCut",
    name: "Sky cut",
    clip: "skyCut",
    pitch: 1.1,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -36, 30, -4],
        power: BLOW_POWER.skyCut,
        kx: 20,
        ky: -40,
        slash: SKY,
        feel: STRING_FEEL.skyCut,
      },
    ],
  },
  shieldFall: {
    id: "shieldFall",
    name: "Shield fall",
    clip: "shieldFall",
    pitch: 0.7,
    falls: true,
    untilLanding: true,
    hits: [
      {
        at: onFrame(3),
        box: [-10, -20, 16, 14],
        power: BLOW_POWER.shieldFall,
        kx: 20,
        ky: ENEMY_AIR.spike,
        spike: true,
        big: true,
        feel: STRING_FEEL.shieldFall,
      },
    ],
    step: (t) => {
      hero.vx = 0;
      hero.vy = t < SHIELD_FALL.tuck ? Math.min(hero.vy, -20) : SHIELD_FALL.dive;
    },
    land: fallLanding,
  },
} satisfies Record<AldricMoveId, MoveDef>;
