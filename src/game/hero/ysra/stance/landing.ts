import { WORLD_COLORS } from "../../../../constants/palette";
import { QUAKE } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { createFloorRing } from "../../../effects/floorRing";
import { createShockwave } from "../../../effects/shockwave";
import { type Blow, meleeHit } from "../../../meleeHit";
import { hasPerk } from "../../../progress";
import { game, hero, particles, progress, rng } from "../../../state";
import { dust, newSwing, shake } from "../../../world";
import { skin } from "../../skin";
import { warpShock } from "../../warpShock";
import { emitYsra } from "../events";

/** where she came down from, for the land event */
type LandFrom = "vault" | "dive";

/** Earthshaker: a landing out of a vault or a dive sends a shockwave along the floor both ways */
function quake(): void {
  if (!hasPerk("earthshaker")) return;
  game.fx.push(createShockwave(hero.x, hero.y, progress.stats.ad * QUAKE.power, skin.ramp));
  shake(0.3, 3);
}

/** stone chips kicked up to both sides of where she came down */
function chips(n: number): void {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    particles.spawn(
      PK.SHARD,
      hero.x + side * rng.range(2, 8),
      hero.y - 1,
      side * rng.range(30, 90),
      -rng.range(60, 140),
      0.5,
      {
        col: WORLD_COLORS.stoneTop,
        size: rng.range(1.5, 2.5),
      },
    );
  }
}

/** she came down out of a vault or a dive: the land event, Earthshaker, and Warp Shock off a vault */
function landed(from: LandFrom): void {
  emitYsra("land", { x: hero.x, y: hero.y, from });
  if (from === "vault") warpShock();
  quake();
}

/** a vault comes down on both feet: a thud, dust both ways, a small shake */
export function vaultLanding(): void {
  dust(hero.x - 5, hero.y, 5, -1);
  dust(hero.x + 5, hero.y, 5, 1);
  shake(0.12, 1.4);
  sfx.hit(false, 0.55);
  landed("vault");
}

/** the glaive goes into the floor point first: a ring this wide each way, dust and stone both ways, and a heavy shake */
export function impactBurst(from: LandFrom, reach: number): void {
  game.fx.push(createFloorRing(hero.x + hero.face * 8, hero.y, reach, skin.ramp, 0.4));
  dust(hero.x - 6, hero.y, 7, -1);
  dust(hero.x + 6, hero.y, 7, 1);
  chips(8);
  shake(0.24, 3);
  landed(from);
}

/** the dive's point goes into the floor: the burst, and every foe in the box struck */
export function diveImpact(box: Box, blow: Blow): void {
  newSwing();
  impactBurst("dive", (box[2] - box[0]) / 2);
  const hits = meleeHit([box], blow);
  if (!hits) sfx.hit(true, 0.5);
  emitYsra("strike", { source: "dive", hits });
}
