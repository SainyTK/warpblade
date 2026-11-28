import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { waveScale } from "../../../../utils/progression";
import { createIceSpike } from "../cryomancer/spike";
import { createIcicleDrop } from "../rimeclaw/icicleDrop";
import { COLOSSUS_COLORS } from "./colors";
import { COLOSSUS, COLOSSUS_HITS } from "./constants";
import { createQuakeWarning } from "./quake";
import { recoverFrom } from "./recovery";

export function raiseSlam(e: Enemy): void {
  Object.assign(e, { state: "wind", st: 0 });
  game.fx.push(createQuakeWarning(e, COLOSSUS.slamWind * waveScale(game.wave).windup));
  sfx.swing(0.6);
}

export function slam(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const box = [e.x - COLOSSUS.slamReach, GROUND - COLOSSUS.slamHeight, e.x + COLOSSUS.slamReach, GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(COLOSSUS_HITS.slam * e.power, e.x);
  });
  COLOSSUS.spikeGaps.forEach((gap, i) => {
    for (const side of [-1, 1]) {
      const x = clampStageX(e.x + side * gap, 8);
      game.fx.push(createIceSpike(x, GROUND, COLOSSUS.spikeDelay * (i + 1), COLOSSUS_HITS.spike * e.power));
    }
  });
  shake(0.3, 3);
  sfx.boom();
  dust(e.x - 20, GROUND, 8, -1);
  dust(e.x + 20, GROUND, 8, 1);
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-24, 24),
      GROUND - 2,
      fxRng.range(-120, 120),
      -fxRng.range(50, 160),
      0.6,
      {
        col: fxRng.pick(COLOSSUS_COLORS.ice),
        size: fxRng.range(1, 2.4),
      },
    );
}

export function endSlam(e: Enemy): void {
  recoverFrom(e, "exposed");
  sfx.shatter();
}

export function raiseCall(e: Enemy): void {
  Object.assign(e, { state: "summon", st: 0 });
  sfx.swing(0.5);
}

export function callIcicles(e: Enemy): void {
  for (let i = -1; i <= 1; i++) {
    const x = clampStageX(hero.x + i * COLOSSUS.icicleGap + fxRng.range(-4, 4), 10);
    game.fx.push(createIcicleDrop(x, COLOSSUS.icicleWarn + Math.abs(i) * 0.25, COLOSSUS_HITS.icicle * e.power));
  }
  shake(0.25, 2.5);
  sfx.boom();
  dust(e.x + e.face * 10, GROUND, 6);
  recoverFrom(e, "settle");
}
