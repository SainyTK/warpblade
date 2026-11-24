import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { WORLD_COLORS } from "../../../../constants/palette";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { fxRng, game, hero, particles } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { PK } from "../../../../types/particle";
import { BREAKER_STEP, STRING_CANCEL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { breakerLanded } from "../skills/breechSlam";
import { SLASHES } from "./slashes";

/** Breaker meets the floor: a ring, dust and rubble where the blade bites, and Breech Slam's shock when held */
function breakerImpact(): void {
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 24;
  game.fx.push(createFloorRing(gx, hero.y, 28, skin.ramp, 0.35));
  dust(gx, hero.y, 7, hero.face);
  for (let i = 0; i < 5; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * fxRng.range(20, 110),
      fxRng.range(-170, -60),
      fxRng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: fxRng.range(1.5, 3),
      },
    );
  shake(0.2, 2);
  breakerLanded(gx);
}

/**
 * The ground string, the same every time: Hew, a falling diagonal; Rip, a rising backhand; and Breaker, a stepping
 * overhead slam that knocks down and closes the string.
 */
export const STRING_MOVES = {
  hew: {
    id: "hew",
    name: "Hew",
    clip: "hew",
    pitch: 0.9,
    cancel: STRING_CANCEL.hew,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -40, 32, -2],
        power: STRING_POWER.hew,
        kx: 10,
        ky: -20,
        slash: SLASHES.hew,
        feel: STRING_FEEL.hew,
      },
    ],
  },
  rip: {
    id: "rip",
    name: "Rip",
    clip: "rip",
    pitch: 1,
    cancel: STRING_CANCEL.rip,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -46, 28, -2],
        power: STRING_POWER.rip,
        kx: 10,
        ky: -40,
        slash: SLASHES.rip,
        feel: STRING_FEEL.rip,
      },
    ],
  },
  breaker: {
    id: "breaker",
    name: "Breaker",
    clip: "breaker",
    pitch: 0.65,
    cancel: STRING_CANCEL.breaker,
    hits: [
      {
        at: onFrame(7),
        box: [-2, -42, 40, 2],
        power: STRING_POWER.breaker,
        kx: 60,
        ky: -60,
        stun: 0.8,
        big: true,
        wall: true,
        slash: SLASHES.breaker,
        feel: STRING_FEEL.breaker,
      },
    ],
    strides: [{ from: frame(3), to: frame(7), speed: BREAKER_STEP }],
    afterHit: breakerImpact,
  },
} satisfies Record<string, MoveDef>;
