import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { DAY_SPARKS } from "../../../../game/enemies/day/colors";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { VINE, VINE_HITS } from "./constants";

export const windTime = (): number => VINE.wind * waveScale(game.wave).windup;

export const whipBox = (e: Enemy): Box => {
  const a = e.x + e.face * VINE.shoulderX;
  const b = e.x + e.face * VINE.reach;
  return [Math.min(a, b), e.y + VINE.strip[0], Math.max(a, b), e.y + VINE.strip[1]];
};

function leaves(x: number, y: number, n: number, spread: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-spread, spread),
      y + fxRng.range(-2, 2),
      fxRng.range(-40, 40),
      -fxRng.range(20, 70),
      fxRng.range(0.3, 0.6),
      { sparks: DAY_SPARKS.leaf },
    );
}

function shuffle(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const sees = foeSees(e);
  let want = 0;
  if (!sees || gap > VINE.reach - 8) want = e.face * VINE.pace;
  else if (gap < VINE.near) want = -e.face * VINE.pace * 0.7;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 160 * dt);
  const ready = e.cd <= 0 && sees && hero.state !== "dead" && facesHero(e);
  if (ready && gap < VINE.reach - 2 && Math.abs(hero.y - e.y) < 30) Object.assign(e, { state: "wind", st: 0 });
}

function coil(e: Enemy, ts: number): void {
  if (fxRng.chance(0.25 * ts)) leaves(e.x - e.face * 10, e.y - 20, 1, 4);
  if (e.pinned > 0) e.st = Math.min(e.st, windTime() * 0.9);
  if (e.st < windTime()) return;
  Object.assign(e, { state: "lunge", st: 0, n: 0 });
  sfx.swingHeavy(0.8);
}

function lash(e: Enemy): void {
  if (e.st >= VINE.hitFrom && e.st <= VINE.hitTo) {
    const box = whipBox(e);
    eachStanding(() => {
      const bit = 1 << heroSlot();
      if (e.n & bit || !boxHit(box, heroBox())) return;
      e.n |= bit;
      hurtHero(VINE_HITS.whip * e.power, e.x);
    });
  }
  if (e.st < VINE.crack) return;
  Object.assign(e, { state: "recover", st: 0 });
  const tip = e.x + e.face * (VINE.reach - 4);
  dust(tip, GROUND, 4, e.face);
  leaves(tip, GROUND - 2, 4, 6);
  sfx.hit(false, 1.3);
}

export function updateVinelash(e: Enemy, dt: number, ts: number): void {
  if (e.state === "walk") shuffle(e, dt);
  else if (e.state === "wind") coil(e, ts);
  else if (e.state === "lunge") lash(e);
  else if (e.st >= VINE.lie)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.8) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-5, 5), e.y - fxRng.range(8, 18), 0, -10, fxRng.range(0.4, 0.8), {
      sparks: DAY_SPARKS.rift,
    });
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(VINE_HITS.touch * e.power, e.x);
  });
}
