import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { game, hero } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { RAY, RAY_HITS } from "./constants";
import { createChainStrike } from "./strike";

export function callChain(e: Enemy): void {
  const dir = Math.sign(hero.x - e.x) || e.face;
  const reach = Math.abs(hero.x - e.x) + 34;
  const gap = clamp(reach / (RAY.strikes - 1), 22, 40);
  for (let i = 0; i < RAY.strikes; i++) {
    const x = clampStageX(e.x + dir * gap * i, 8);
    game.fx.push(createChainStrike(x, i * RAY.strikeGap, RAY_HITS.strike * e.power));
  }
}

export function swoopAt(e: Enemy, u: number): [number, number] {
  const low = GROUND - RAY.swoopLow;
  const x = e.ax + e.vx * RAY.swoop * u;
  const y = e.ay + (low - e.ay) * Math.sin(Math.PI * u);
  return [x, y];
}

export function strikeOnce(e: Enemy, damage: number): void {
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(damage * e.power, e.x);
  });
}
