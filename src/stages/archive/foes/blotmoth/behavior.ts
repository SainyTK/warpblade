import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { BLOTMOTH, BLOTMOTH_HITS } from "./moves";

const LOW = GROUND - 14;
const landed = new WeakSet<Enemy>();

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.face * 34 + Math.sin(game.t * 1.3 + e.seed) * 14;
  const ty = clamp(hero.y - BLOTMOTH.hover + Math.sin(game.t * 2.1 + e.seed) * 8, 26, GROUND - 24);
  e.vx = approach(e.vx, clamp((tx - e.x) * 2.5, -BLOTMOTH.speed, BLOTMOTH.speed), 300 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2.5, -BLOTMOTH.speed, BLOTMOTH.speed), 300 * dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 12);
  if (e.cd <= 0 && Math.abs(dx) < BLOTMOTH.reach && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0 });
}

function swoopFrom(e: Enemy): void {
  Object.assign(e, { state: "dive", st: 0, ax: e.x, ay: e.y, n: clampStageX(hero.x + e.face * BLOTMOTH.pass, 10) });
  landed.delete(e);
  sfx.swing(2);
}

function swoop(e: Enemy, dt: number): void {
  const u = clamp(e.st / BLOTMOTH.swoop);
  const nx = e.ax + (e.n - e.ax) * u;
  const ny = e.ay + (LOW - e.ay) * Math.sin(Math.PI * u);
  e.vx = (nx - e.x) / Math.max(dt, 1e-3);
  e.x = clampStageX(nx, 10);
  e.y = clamp(ny, 20, GROUND - 8);
  eachStanding(() => {
    if (landed.has(e) || !boxHit(enemyBox(e), heroBox())) return;
    landed.add(e);
    hurtHero(BLOTMOTH_HITS.swoop * e.power, e.x);
  });
  if (u >= 1) Object.assign(e, { state: "recover", st: 0, vy: -40 });
}

export function updateBlotmoth(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, 0, 300 * dt);
    e.y = Math.max(20, e.y - 14 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-5, 5), e.y + fxRng.range(-3, 3), 0, 12, 0.3, {
        col: FOE.inkSheen,
        size: 0.5,
      });
    if (e.st >= BLOTMOTH.wind * waveScale(game.wave).windup) swoopFrom(e);
  } else if (e.state === "dive") swoop(e, dt);
  else {
    e.vx -= e.vx * 3 * dt;
    e.vy = approach(e.vy, -20, 120 * dt);
    e.x = clampStageX(e.x + e.vx * dt, 10);
    e.y = clamp(e.y + e.vy * dt, 20, GROUND - 12);
    if (e.st >= BLOTMOTH.recover)
      Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.3, 2.1) * waveScale(game.wave).cooldown });
  }
  if (fxRng.chance(0.04 * ts)) particles.spawn(PK.MOTE, e.x, e.y + 2, 0, 16, 0.6, { col: FOE.ink[3], size: 0.6 });
}
