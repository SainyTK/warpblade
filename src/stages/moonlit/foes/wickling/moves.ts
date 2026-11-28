import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GHOST_EMBERS } from "../graveColors";
import { freshStrike, strikeOnce } from "../strike";

export const WICK = {
  side: 34,
  hover: 34,
  reach: 52,
  flare: 0.5,
  swoop: 0.55,
  past: 30,
  recover: 0.7,
  top: 26,
} as const;
export const WICK_HITS = { swoop: 6 } as const;

export const flareTime = (): number => WICK.flare * waveScale(game.wave).windup;

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const bob = Math.sin(game.t * 3.1 + e.seed) * 4;
  const tx = hero.x - e.side * WICK.side;
  const ty = hero.y - WICK.hover - 6 + bob;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.6, -60, 60), 200 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -50, 50), 200 * dt);
  if (e.cd <= 0 && Math.abs(dx) < WICK.reach && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0 });
}

function flare(e: Enemy, dt: number): void {
  e.face = Math.sign(hero.x - e.x) || e.face;
  e.vx = approach(e.vx, 0, 200 * dt);
  e.vy = approach(e.vy, -10, 200 * dt);
  if (fxRng.chance(dt * 18))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-2, 2), e.y - 8, fxRng.range(-10, 10), -fxRng.range(14, 30), 0.35, {
      sparks: GHOST_EMBERS,
    });
  if (e.st < flareTime()) return;
  const side = Math.sign(hero.x - e.x) || e.face;
  freshStrike(e);
  Object.assign(e, {
    state: "dive",
    st: 0,
    face: side,
    ax: e.x,
    ay: e.y,
    n: clampStageX(hero.x + side * WICK.past, 10),
    vx: 0,
    vy: 0,
  });
  sfx.swing(1.4);
}

function swoop(e: Enemy): void {
  const u = clamp(e.st / WICK.swoop);
  const bottom = Math.min(GROUND - 8, hero.y - 14);
  e.x = lerp(e.ax, e.n, u);
  e.y = lerp(e.ay, bottom, Math.sin(Math.PI * u));
  strikeOnce(e, enemyBox(e), WICK_HITS.swoop * e.power);
  if (u >= 1) Object.assign(e, { state: "recover", st: 0, vx: e.face * 20, vy: -20 });
}

export function updateWickling(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") flare(e, dt);
  else if (e.state === "dive") {
    swoop(e);
    return;
  } else if (e.st >= WICK.recover)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.8, 2.6) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, WICK.top, GROUND - 10);
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-1, 1), e.y - 9, fxRng.range(-3, 3), -fxRng.range(6, 14), 0.4, {
      sparks: GHOST_EMBERS,
    });
}
