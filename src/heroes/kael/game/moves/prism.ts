import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { PAL, WORLD_COLORS } from "../../../../constants/palette";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { PK } from "../../../../types/particle";
import { PRISM_CANCEL, PRISM_FEEL, PRISM_STRIDE, SHATTER } from "../../constants/prism";
import { STRING_CANCEL } from "../../constants/string";
import { createShatterMotes } from "../prism/motes";
import { lodgeInStruck, shatterShards } from "../prism/shards";
import { CLEAVE, STAB } from "./slashes";

const P = PAL.prism;
/** the thrust's long narrow crescent */
const PRISM_STAB = { ...STAB, R: 30, ramp: P };
/** the straight cut from overhead into the floor */
const SHATTER_CUT = { ...CLEAVE, cx: 8, R: 27, W: 11, sy: 0.95, rot: 0.05, a0: -2.05, a1: 1.3, trail: 0.24, ramp: P };

/** Shatterfall meets the floor: a floor ring and dust where the point goes in, rubble, and every shard nearby breaks */
function shatterfallImpact(): void {
  shatterShards();
  if (!hero.ground) return;
  const gx = hero.x + hero.face * SHATTER.ahead;
  game.fx.push(createFloorRing(gx, hero.y, 30, P, 0.35));
  dust(gx, hero.y, 6, hero.face);
  for (let i = 0; i < 4; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * rng.range(20, 100),
      rng.range(-160, -60),
      rng.range(0.4, 0.8),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 2.5),
      },
    );
}

/**
 * The Prism Knight's end of the ground string: Prism Thrust, a long lunge whose one blow lodges a prism shard in each
 * foe it strikes, and Shatterfall, an overhead cut into the floor that knocks down and shatters every shard nearby
 */
export const PRISM_MOVES = {
  prismThrust: {
    id: "prismThrust",
    name: "Prism thrust",
    clip: "prismThrust",
    pitch: 1.2,
    cancel: PRISM_CANCEL.prismThrust,
    hits: [
      {
        at: onFrame(5),
        box: [0, -26, 44, -10],
        power: 1.5,
        kx: 18,
        ky: -10,
        slash: PRISM_STAB,
        feel: PRISM_FEEL.prismThrust,
      },
    ],
    strides: [
      {
        from: frame(PRISM_STRIDE.thrust.from),
        to: frame(PRISM_STRIDE.thrust.to),
        speed: PRISM_STRIDE.thrust.speed,
      },
    ],
    afterHit: lodgeInStruck,
  },
  shatterfall: {
    id: "shatterfall",
    name: "Shatterfall",
    clip: "shatterfall",
    pitch: 0.75,
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(7),
        box: [-2, -42, 36, 2],
        power: 2.1,
        kx: 50,
        ky: -60,
        stun: 0.8,
        big: true,
        wall: true,
        slash: SHATTER_CUT,
        feel: PRISM_FEEL.shatterfall,
      },
    ],
    strides: [
      {
        from: frame(PRISM_STRIDE.shatterfall.from),
        to: frame(PRISM_STRIDE.shatterfall.to),
        speed: PRISM_STRIDE.shatterfall.speed,
      },
    ],
    enter: () => {
      game.fx.push(createShatterMotes());
    },
    afterHit: shatterfallImpact,
  },
} satisfies Record<string, MoveDef>;
