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
import { createEmber } from "./ember";

export const BAT_HITS = { ember: 10, swoop: 9 } as const;
export const BAT_TIMES = { wind: 0.5, swoop: 0.9, drop: 0.45, recover: 0.8 } as const;
const BAT_MOVE = { hover: 50, side: 36, reach: 110, past: 46, low: 40, top: 22 } as const;

interface SwoopPath {
  fromX: number;
  fromY: number;
  toX: number;
  bottom: number;
}

const paths = new WeakMap<Enemy, SwoopPath>();

function startSwoop(e: Enemy): void {
  const side = Math.sign(hero.x - e.x) || e.face;
  paths.set(e, {
    fromX: e.x,
    fromY: e.y,
    toX: clampStageX(hero.x + side * BAT_MOVE.past, 10),
    bottom: Math.max(e.y + 14, hero.y - BAT_MOVE.low),
  });
  Object.assign(e, { state: "dive", st: 0, n: 0, face: side, side, vx: 0, vy: 0 });
  sfx.swing(1.6);
}

function swoop(e: Enemy): void {
  const path = paths.get(e);
  if (!path) {
    Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  const u = clamp(e.st / BAT_TIMES.swoop);
  e.x = lerp(path.fromX, path.toX, u);
  e.y = lerp(path.fromY, path.bottom, Math.sin(Math.PI * u));
  if ((e.n & 1) === 0 && u >= BAT_TIMES.drop / BAT_TIMES.swoop) {
    e.n |= 1;
    const drift = ((path.toX - path.fromX) / BAT_TIMES.swoop) * 0.25;
    game.fx.push(createEmber(e.x, e.y + 3, drift, BAT_HITS.ember * e.power));
    for (let i = 0; i < 6; i++)
      particles.spawn(PK.SPARK, e.x, e.y + 2, fxRng.range(-40, 40), fxRng.range(-20, 40), 0.3, {
        sparks: FORGE_SPARKS.ember,
      });
  }
  eachStanding(() => {
    if ((e.n & 2) === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n |= 2;
      hurtHero(BAT_HITS.swoop * e.power, e.x);
    }
  });
  if (u >= 1) {
    paths.delete(e);
    Object.assign(e, { state: "recover", st: 0, vx: 0, vy: 0 });
  }
}

export function updateEmberbat(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const hy = hero.y - 18;
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    const bob = Math.sin(game.t * 2.6 + e.seed) * 5;
    const tx = hero.x - e.side * BAT_MOVE.side + Math.sin(game.t * 1.1 + e.seed) * 12;
    const ty = hero.y - BAT_MOVE.hover + bob;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.5, -70, 70), 220 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -60, 60), 240 * dt);
    if (e.cd <= 0 && Math.abs(dx) < BAT_MOVE.reach && hero.state !== "dead" && foeSees(e))
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.face = Math.sign(dx) || e.face;
    e.vx = approach(e.vx, 0, 220 * dt);
    e.vy = approach(e.vy, -14, 200 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.EMBER, e.x + fxRng.range(-8, 8), e.y + fxRng.range(-3, 3), 0, 10, 0.3, {
        sparks: FORGE_SPARKS.ember,
      });
    if (e.st >= BAT_TIMES.wind * waveScale(game.wave).windup) startSwoop(e);
  } else if (e.state === "dive") {
    swoop(e);
    return;
  } else {
    e.vy = approach(e.vy, clamp((hy - 8 - e.y) * 1.5, -30, 30), 120 * dt);
    if (e.st >= BAT_TIMES.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.5, 2.5) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, BAT_MOVE.top, GROUND - 12);
  if (fxRng.chance(0.1 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + fxRng.range(-4, 4),
      e.y + 2,
      fxRng.range(-4, 4),
      fxRng.range(4, 12),
      fxRng.range(0.3, 0.6),
      {
        sparks: FORGE_SPARKS.ember,
      },
    );
}
