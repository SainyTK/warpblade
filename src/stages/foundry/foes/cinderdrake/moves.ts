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
import { FORGE_SPARKS } from "../../colors";
import { createCinderBolt } from "./bolt";

export const DRAKE_HITS = { bolt: 24, rake: 24 } as const;
export const DRAKE_TIMES = { breathe: 0.85, volley: 0.5, rise: 0.75, dive: 0.8, tired: 1.4 } as const;
const DRAKE_MOVE = {
  hover: 66,
  side: 64,
  reach: 150,
  rake: 70,
  speed: 130,
  shots: 3,
  spread: 0.18,
  low: 30,
  top: 20,
} as const;
const VOLLEY_GAP = DRAKE_TIMES.volley / DRAKE_MOVE.shots;

interface DivePath {
  fromX: number;
  fromY: number;
  toX: number;
  bottom: number;
}

const paths = new WeakMap<Enemy, DivePath>();

export const mouthOf = (e: Enemy): [number, number] => [e.x + e.face * 13, e.y - 7];

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * DRAKE_MOVE.side + Math.sin(game.t * 0.8 + e.seed) * 16;
  const ty = hero.y - DRAKE_MOVE.hover + Math.sin(game.t * 2 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -70, 70), 160 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -50, 50), 180 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e) || Math.abs(dx) > DRAKE_MOVE.reach) return;
  const close = Math.abs(dx) < DRAKE_MOVE.rake;
  Object.assign(e, { state: close ? "charge" : "wind", st: 0, n: 0 });
  sfx.swing(close ? 0.7 : 0.5);
}

function shoot(e: Enemy): void {
  const [mx, my] = mouthOf(e);
  const angle = Math.atan2(hero.y - 16 - my, hero.x - mx) + (e.n - 1) * DRAKE_MOVE.spread;
  game.fx.push(
    createCinderBolt(
      mx,
      my,
      Math.cos(angle) * DRAKE_MOVE.speed,
      Math.sin(angle) * DRAKE_MOVE.speed,
      DRAKE_HITS.bolt * e.power,
    ),
  );
  sfx.cast();
  e.n++;
}

function startDive(e: Enemy): void {
  const side = Math.sign(hero.x - e.x) || e.face;
  paths.set(e, {
    fromX: e.x,
    fromY: e.y,
    toX: clampStageX(hero.x + side * 50, 12),
    bottom: Math.max(e.y + 16, hero.y - 18),
  });
  Object.assign(e, { state: "dive", st: 0, n: 0, face: side, vx: 0, vy: 0 });
  sfx.swingHeavy(0.8);
}

function dive(e: Enemy): void {
  const path = paths.get(e);
  if (!path) {
    Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  const u = clamp(e.st / DRAKE_TIMES.dive);
  e.x = lerp(path.fromX, path.toX, u);
  e.y = lerp(path.fromY, path.bottom, Math.sin(Math.PI * u * 0.8));
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(DRAKE_HITS.rake * e.power, e.x);
    }
  });
  if (u >= 1) {
    paths.delete(e);
    Object.assign(e, { state: "recover", st: 0, vx: 0, vy: 0 });
  }
}

function tired(e: Enemy, dt: number, ts: number): void {
  const low = hero.y - DRAKE_MOVE.low;
  e.vx = approach(e.vx, 0, 80 * dt);
  e.vy = approach(e.vy, clamp((low - e.y) * 1.5, -30, 30), 100 * dt);
  if (fxRng.chance(0.4 * ts))
    particles.spawn(PK.SMOKE, mouthOf(e)[0], mouthOf(e)[1], e.face * 6, -14, 0.6, { col: 0x3a2c28, size: 1.6 });
  if (e.st >= DRAKE_TIMES.tired)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
}

export function updateCinderdrake(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, -e.face * 10, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    const [mx, my] = mouthOf(e);
    if (fxRng.chance(0.7 * ts))
      particles.spawn(PK.EMBER, mx + fxRng.range(-6, 6), my + fxRng.range(-6, 6), (mx - e.x) * -0.5, 0, 0.3, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.st >= DRAKE_TIMES.breathe * scale.windup) Object.assign(e, { state: "volley", st: 0, n: 0 });
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.n < DRAKE_MOVE.shots && e.st >= e.n * VOLLEY_GAP) shoot(e);
    if (e.st >= DRAKE_TIMES.volley + 0.1) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, -e.face * 20, 200 * dt);
    e.vy = approach(e.vy, -26, 200 * dt);
    if (e.st >= DRAKE_TIMES.rise * scale.windup) startDive(e);
  } else if (e.state === "dive") {
    dive(e);
    return;
  } else tired(e, dt, ts);
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, DRAKE_MOVE.top, GROUND - 14);
}
