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
import { RAY, RAY_HITS } from "./constants";
import { callChain, strikeOnce, swoopAt } from "./moves";
import { chargeTime, tuckTime } from "./timing";

export const charging = (e: Enemy): boolean => e.state === "volley";

function glide(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const tx = hero.x - e.side * (RAY.hover + ((e.seed * 7) % 20));
  const ty = hero.y - RAY.height - ((e.seed * 3) % 12) + Math.sin(game.t * 1.1 + e.seed) * 6;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -RAY.drift, RAY.drift), 150 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -RAY.drift, RAY.drift), 150 * dt);
  const dx = Math.abs(hero.x - e.x);
  if (e.cd > 0 || dx > RAY.sense || hero.state === "dead" || !foeSees(e)) return;
  e.face = Math.sign(hero.x - e.x) || e.face;
  const swoop = dx > 50 && dx < 120 && rng.chance(0.5);
  Object.assign(e, {
    state: swoop ? "wind" : "volley",
    st: 0,
    n: 0,
    ay: Math.max(RAY.chargeTop, e.y - RAY.chargeRise),
  });
  if (swoop) sfx.swing(0.7);
  else sfx.cast();
}

function gather(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 200 * dt);
  e.vy = approach(e.vy, clamp((e.ay - e.y) * 2, -40, 40), 200 * dt);
  if (fxRng.chance(dt * 40))
    particles.spawn(PK.SPARK, e.x + fxRng.range(-14, 14), e.y + fxRng.range(-8, 8), 0, 0, 0.15, {
      sparks: STORM_SPARKS,
    });
  if (e.st < chargeTime()) return;
  callChain(e);
  Object.assign(e, { state: "shoot", st: 0 });
}

function linger(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 200 * dt);
  e.vy = approach(e.vy, 0, 200 * dt);
  if (e.st >= RAY.linger) Object.assign(e, { state: "recover", st: 0 });
}

function tuck(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, -e.face * 18, 200 * dt);
  e.vy = approach(e.vy, -22, 200 * dt);
  if (e.st < tuckTime()) return;
  const span = clamp(Math.abs(hero.x - e.x) * 2, RAY.swoopSpan[0], RAY.swoopSpan[1]);
  e.face = Math.sign(hero.x - e.x) || e.face;
  Object.assign(e, { state: "dive", st: 0, n: 0, ax: e.x, ay: e.y, vx: (e.face * span) / RAY.swoop, vy: 0 });
  sfx.swing(0.6);
}

function swoop(e: Enemy): void {
  const u = clamp(e.st / RAY.swoop);
  const [x, y] = swoopAt(e, u);
  e.x = clampStageX(x, 14);
  e.y = y;
  strikeOnce(e, RAY_HITS.swoop);
  if (u > 0.3 && u < 0.7 && fxRng.chance(0.5))
    particles.spawn(PK.DUST, e.x, GROUND - 1, -e.face * 30, -10, 0.4, { col: 0x5a4a36, size: 1.5 });
  if (u < 1) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.face * 40, vy: -40 });
}

function rest(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 100 * dt);
  e.vy = approach(e.vy, -10, 100 * dt);
  if (e.st < RAY.recover) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.6, 2.6) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

function brush(e: Enemy): void {
  if (e.state !== "drift" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(RAY_HITS.touch * e.power, e.x);
  });
}

export function updateThunderray(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") glide(e, dt);
  else if (e.state === "volley") gather(e, dt);
  else if (e.state === "shoot") linger(e, dt);
  else if (e.state === "wind") tuck(e, dt);
  else if (e.state === "dive") swoop(e);
  else rest(e, dt);
  if (e.state === "dive") return;
  if (e.state === "drift") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 14);
  brush(e);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.SPARK, e.x - e.face * fxRng.range(14, 28), e.y + fxRng.range(-2, 4), 0, 14, 0.25, {
      sparks: STORM_SPARKS,
    });
}
