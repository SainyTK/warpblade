import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { turnToHero } from "../../../../game/enemies/facing";
import { STORM_SPARKS } from "../../../../game/enemies/rain/colors";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MIDGE, MIDGE_HITS } from "./constants";
import { rearTime } from "./timing";

function hover(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const jitter = Math.sin(game.t * 9 + e.seed * 3) * 4;
  const tx = hero.x - e.side * (MIDGE.hover + ((e.seed * 5) % 12)) + jitter;
  const ty = hero.y - MIDGE.rise - ((e.seed * 3) % 10) + Math.sin(game.t * 7 + e.seed) * 3;
  e.vx = approach(e.vx, clamp((tx - e.x) * 2.2, -MIDGE.drift, MIDGE.drift), 320 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2.2, -MIDGE.drift, MIDGE.drift), 320 * dt);
  const near = Math.abs(hero.x - e.x) < MIDGE.reach;
  if (e.cd > 0 || !near || hero.state === "dead" || !foeSees(e)) return;
  e.face = Math.sign(hero.x - e.x) || e.face;
  Object.assign(e, { state: "wind", st: 0 });
  sfx.chime(6);
}

function rear(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, -e.face * 18, 300 * dt);
  e.vy = approach(e.vy, -14, 300 * dt);
  if (e.st < rearTime()) return;
  const dx = hero.x - e.x;
  const dy = hero.y - 14 - e.y;
  const len = Math.hypot(dx, dy) || 1;
  e.face = Math.sign(dx) || e.face;
  Object.assign(e, {
    state: "dive",
    st: 0,
    n: 0,
    vx: (dx / len) * MIDGE.swoopSpeed,
    vy: (dy / len) * MIDGE.swoopSpeed,
  });
  sfx.swing(1.9);
}

function swoop(e: Enemy, dt: number): void {
  e.vy -= 160 * dt;
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(MIDGE_HITS.swoop * e.power, e.x);
  });
  if (fxRng.chance(dt * 30))
    particles.spawn(PK.SPARK, e.x, e.y, -e.vx * 0.2, -e.vy * 0.2, 0.18, { sparks: STORM_SPARKS });
  if (e.st >= MIDGE.swoop) Object.assign(e, { state: "recover", st: 0 });
}

function settle(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 200 * dt);
  e.vy = approach(e.vy, -20, 200 * dt);
  if (e.st < MIDGE.recover) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateFenmidge(e: Enemy, dt: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") rear(e, dt);
  else if (e.state === "dive") swoop(e, dt);
  else settle(e, dt);
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, 18, GROUND - 8);
}
