import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { fxRng, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import { ROOTCALLER_COLORS, ROOTCALLER_SPARKS } from "./colors";
import { ROOTCALLER } from "./constants";
import { drawRootcaller } from "./draw";
import { updateRootcaller, warded } from "./moves";

export const rootcaller: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 36, e.x + 7, e.y],
  center: (e) => [e.x, e.y - 20],
  rest: "walk",
  firstCooldown: () => 1.3,
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateRootcaller,
  draw: drawRootcaller,
  glow: { radius: 22, color: ROOTCALLER_COLORS.seed[2], eyeY: -14 },
  takes(e, dmg, loud) {
    if (!warded(e)) return dmg;
    if (loud) {
      sfx.block();
      for (let i = 0; i < 4; i++)
        particles.spawn(PK.SHARD, e.x, e.y - fxRng.range(6, 26), fxRng.range(-60, 60), -fxRng.range(30, 90), 0.4, {
          col: fxRng.pick(ROOTCALLER_SPARKS.bark),
          size: fxRng.range(1, 2),
        });
    }
    return dmg * ROOTCALLER.ward;
  },
  orbs: 3,
  heartChance: 0.25,
};
