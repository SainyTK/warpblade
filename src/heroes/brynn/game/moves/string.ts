import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { WORLD_COLORS } from "../../../../constants/palette";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { game, hero, particles, rng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { PK } from "../../../../types/particle";
import { CRIMSON } from "../../constants/colors";
import { HEAVE_LAUNCH, STRING_CANCEL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { slamLanded } from "../slam";
import { SLASH } from "./slashes";

/** the slam meets the floor: a ring, dust and rubble where the blade lands, then its shockwave or fissure */
function slamImpact(): void {
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 26;
  game.fx.push(createFloorRing(gx, hero.y, 26, CRIMSON, 0.35));
  dust(gx, hero.y, 8, hero.face);
  for (let i = 0; i < 7; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * rng.range(10, 110),
      rng.range(-200, -70),
      rng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.24, 3);
  slamLanded(gx);
}

/**
 * Brynn's ground string: a wide sweep that staggers the whole arc, a rising heave that throws foes up, and the anvil slam
 * whose tall arc catches the launched foes, drives them into the floor and sends a shockwave along it.
 */
export const STRING_MOVES = {
  sweep: {
    id: "sweep",
    name: "Wide Sweep",
    clip: "sweep",
    pitch: 0.75,
    cancel: STRING_CANCEL.sweep,
    hits: [
      {
        at: onFrame(7),
        box: [-10, -34, 42, -2],
        power: STRING_POWER.sweep,
        kx: 12,
        ky: -10,
        stagger: 0.8,
        slash: SLASH.sweep,
        feel: STRING_FEEL.sweep,
      },
    ],
  },
  heave: {
    id: "heave",
    name: "Rising Heave",
    clip: "heave",
    pitch: 0.7,
    cancel: STRING_CANCEL.heave,
    hits: [
      {
        at: onFrame(7),
        box: [-4, -58, 34, 2],
        power: STRING_POWER.heave,
        kx: 8,
        ky: 0,
        launch: HEAVE_LAUNCH,
        slash: SLASH.heave,
        feel: STRING_FEEL.heave,
      },
    ],
  },
  slam: {
    id: "slam",
    name: "Anvil Slam",
    clip: "slam",
    pitch: 0.55,
    cancel: STRING_CANCEL.slam,
    hits: [
      {
        at: onFrame(9),
        box: [-2, -62, 40, 4],
        power: STRING_POWER.slam,
        kx: 60,
        ky: -40,
        spike: true,
        stun: 0.9,
        big: true,
        wall: true,
        slash: SLASH.slam,
        feel: STRING_FEEL.slam,
      },
    ],
    strides: [{ from: frame(6), to: frame(9), speed: 110 }],
    afterHit: slamImpact,
  },
} satisfies Record<string, MoveDef>;
