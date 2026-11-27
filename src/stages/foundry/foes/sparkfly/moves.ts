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
import { FORGE_SPARKS } from "../../colors";

export const FLY_HITS = { dart: 6 } as const;
export const FLY_TIMES = { wind: 0.45, dart: 0.42, recover: 0.6 } as const;
const FLY_MOVE = { hover: 42, side: 28, reach: 56, speed: 170, top: 24 } as const;

function startDart(e: Enemy): void {
  const tx = hero.x - e.x;
  const ty = hero.y - 14 - e.y;
  const len = Math.hypot(tx, ty) || 1;
  Object.assign(e, {
    state: "dive",
    st: 0,
    n: 0,
    vx: (tx / len) * FLY_MOVE.speed,
    vy: (ty / len) * FLY_MOVE.speed,
    face: Math.sign(tx) || e.face,
  });
  sfx.swing(2);
}

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * FLY_MOVE.side + Math.sin(game.t * 1.7 + e.seed) * 10;
  const ty = hero.y - FLY_MOVE.hover + Math.sin(game.t * 4.1 + e.seed) * 4;
  e.vx = approach(e.vx, clamp((tx - e.x) * 2, -80, 80), 300 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2, -70, 70), 300 * dt);
  if (e.cd <= 0 && Math.abs(dx) < FLY_MOVE.reach && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0 });
}

function dart(e: Enemy): void {
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(FLY_HITS.dart * e.power, e.x);
    }
  });
  if (e.st >= FLY_TIMES.dart || e.y >= GROUND - 6) Object.assign(e, { state: "recover", st: 0, vy: -40 });
}

export function updateSparkfly(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, -e.face * 16, 200 * dt);
    e.vy = approach(e.vy, -10, 200 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.EMBER, e.x - e.face * 3, e.y + 1, 0, 12, 0.25, { sparks: FORGE_SPARKS.molten });
    if (e.st >= FLY_TIMES.wind * waveScale(game.wave).windup) startDart(e);
  } else if (e.state === "dive") dart(e);
  else {
    e.vy = approach(e.vy, -30, 160 * dt);
    if (e.st >= FLY_TIMES.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.1, 1.9) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  if (e.state !== "dive") {
    e.vx -= e.vx * 2 * dt;
    e.vy -= e.vy * 2 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, FLY_MOVE.top, GROUND - 6);
  if (fxRng.chance(0.12 * ts))
    particles.spawn(PK.EMBER, e.x - e.face * 3, e.y + 1, fxRng.range(-4, 4), fxRng.range(6, 14), 0.4, {
      sparks: FORGE_SPARKS.ember,
    });
}
