import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SENTINEL_SPARKS } from "./colors";
import { SENTINEL, SENTINEL_HITS } from "./constants";
import { createSlamWave } from "./wave";

export const raiseTime = (): number => SENTINEL.raise * waveScale(game.wave).windup;
export const guardUp = (e: Enemy): boolean => e.state === "walk";
export const bladeX = (e: Enemy): number => e.x + e.face * 26;

function advance(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const moving = !foeSees(e) || gap > SENTINEL.stand;
  e.vx = approach(e.vx, moving && e.halt <= 0 ? e.face * SENTINEL.pace : 0, 120 * dt);
  const ready = e.cd <= 0 && hero.state !== "dead" && foeSees(e) && facesHero(e);
  if (ready && gap < SENTINEL.reach && Math.abs(hero.y - e.y) < 40)
    Object.assign(e, { state: "wind", st: 0, n: 0, vx: 0 });
}

function gather(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (fxRng.chance(dt * 18))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-6, 6), e.y - fxRng.range(8, 30), 0, -fxRng.range(8, 20), 0.5, {
      sparks: SENTINEL_SPARKS.rift,
    });
  if (e.n === 0 && e.st > 0.08) {
    e.n = 1;
    dust(e.x + e.face * 9, GROUND, 4, e.face);
    sfx.block();
  }
  if (e.st < raiseTime()) return;
  Object.assign(e, { state: "lunge", st: 0, n: 0 });
  sfx.swingHeavy();
}

function impact(e: Enemy): void {
  e.n = 1;
  const x = bladeX(e);
  const box = [
    Math.min(e.x + e.face * 4, x + e.face * 4),
    GROUND - 34,
    Math.max(e.x + e.face * 4, x + e.face * 4),
    GROUND,
  ] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(SENTINEL_HITS.slam * e.power, e.x);
  });
  game.fx.push(createSlamWave(x, e.face, SENTINEL_HITS.wave * e.power));
  shake(0.14, 1.4);
  sfx.boom();
  dust(x, GROUND, 8);
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SHARD, x, GROUND - 2, fxRng.range(-60, 60), -fxRng.range(50, 140), fxRng.range(0.3, 0.6), {
      col: fxRng.pick(SENTINEL_SPARKS.grit),
      size: fxRng.range(1, 2),
    });
}

function slam(e: Enemy): void {
  e.vx = 0;
  if (e.n === 0 && e.st >= SENTINEL.fall) impact(e);
  if (e.st >= SENTINEL.fall + SENTINEL.stuck) Object.assign(e, { state: "recover", st: 0 });
}

function pull(e: Enemy): void {
  e.vx = 0;
  if (e.st < SENTINEL.pull) return;
  dust(bladeX(e), GROUND, 3);
  Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown });
}

export function updateSentinel(e: Enemy, dt: number): void {
  if (e.state === "walk") advance(e, dt);
  else if (e.state === "wind") gather(e, dt);
  else if (e.state === "lunge") slam(e);
  else pull(e);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(SENTINEL_HITS.touch * e.power, e.x);
  });
}
