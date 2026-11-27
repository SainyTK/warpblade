import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { game, hero } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SEER_HITS } from "./colors";
import { SEER_MOVE, SEER_TIMES } from "./constants";
import { createRainSpear } from "./spear";
import { createRainWard } from "./ward";
import { wardTarget } from "./wardTarget";

export const castTime = (): number => SEER_TIMES.cast * waveScale(game.wave).windup;
export const raiseTime = (): number => SEER_TIMES.raise * waveScale(game.wave).windup;

export function plantSpears(e: Enemy): void {
  const lead = clamp(hero.vx * 0.25, -24, 24);
  const middle = hero.x + lead;
  const from = Math.min(GROUND, hero.y) - 4;
  for (let i = -1; i <= 1; i++) {
    const x = clampStageX(middle + i * SEER_MOVE.spearGap, 8);
    const mark = castTime() + Math.abs(i) * 0.12;
    game.fx.push(createRainSpear(x, surfaceBelow(x, from), mark, SEER_HITS.spear * e.power));
  }
}

export function castWard(e: Enemy): boolean {
  const ally = wardTarget(e);
  if (!ally) return false;
  game.fx.push(createRainWard(ally));
  return true;
}
