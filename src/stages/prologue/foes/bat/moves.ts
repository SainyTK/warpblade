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
import { approach, clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BAT_SPARKS } from "./colors";
import { BAT, BAT_HITS } from "./constants";

export const batTell = (): number => BAT.tell * waveScale(game.wave).windup;

function flit(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const jink = Math.sin(game.t * 5.3 + e.seed * 3) * 9 + Math.sin(game.t * 11.7 + e.seed) * 5;
  const tx = hero.x - e.side * BAT.hover + Math.sin(game.t * 1.7 + e.seed) * 14 + jink;
  const ty = hero.y - BAT.height + Math.sin(game.t * 6.1 + e.seed * 2) * 7;
  e.vx = approach(e.vx, clamp((tx - e.x) * 2, -BAT.speed, BAT.speed), 320 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2.4, -BAT.speed, BAT.speed), 360 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e) || Math.abs(dx) > BAT.reach) return;
  Object.assign(e, { state: "wind", st: 0 });
  sfx.chime(3);
}

function hang(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  e.vy = approach(e.vy, 0, 400 * dt);
  e.face = Math.sign(hero.x - e.x) || e.face;
  if (e.st < batTell()) return;
  const span = clamp(hero.x - e.x, -BAT.reach, BAT.reach) * 2;
  const depth = Math.max(hero.y - BAT.through - e.y, 10);
  Object.assign(e, { state: "dive", st: 0, n: 0, ax: e.x, ay: e.y, vx: span, vy: depth });
  sfx.swing(1.6);
}

function swoop(e: Enemy): void {
  const k = clamp(e.st / BAT.swoop);
  e.x = clampStageX(e.ax + e.vx * k, 10);
  e.y = Math.min(GROUND - 8, e.ay + e.vy * Math.sin(Math.PI * k));
  if (fxRng.chance(0.4)) particles.spawn(PK.EMBER, e.x, e.y, 0, 0, 0.25, { sparks: BAT_SPARKS });
  eachStanding(() => {
    if (e.n !== 0 || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(BAT_HITS.swoop * e.power, e.x - Math.sign(e.vx) * 4);
  });
  if (k < 1) return;
  Object.assign(e, { state: "recover", st: 0, vx: Math.sign(e.vx) * 30, vy: -30 });
}

function rest(e: Enemy, dt: number): void {
  e.vy = approach(e.vy, lerp(-40, 0, clamp(e.st / BAT.recover)), 200 * dt);
  if (e.st < BAT.recover) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.4, 2.4) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateBat(e: Enemy, dt: number): void {
  if (e.state === "dive") {
    swoop(e);
    return;
  }
  if (e.state === "drift") flit(e, dt);
  else if (e.state === "wind") hang(e, dt);
  else rest(e, dt);
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 18, GROUND - 12);
}
