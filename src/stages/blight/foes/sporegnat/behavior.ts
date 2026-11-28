import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GNAT } from "./colors";
import { GNAT_MOVE, GNAT_TIMES } from "./moves";
import { startSwoop, swoop } from "./swoop";

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const jitterX = Math.sin(game.t * 7.3 + e.seed) * 6 + Math.sin(game.t * 2.1 + e.seed * 2) * 8;
  const jitterY = Math.sin(game.t * 9.1 + e.seed) * 3;
  const tx = hero.x - e.side * GNAT_MOVE.side + jitterX;
  const ty = hero.y - GNAT_MOVE.hover + jitterY;
  const top = GNAT_MOVE.speed;
  e.vx = approach(e.vx, clamp((tx - e.x) * 2, -top, top), 260 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2, -top, top), 260 * dt);
  const near = Math.abs(dx) < GNAT_MOVE.reach;
  if (e.cd <= 0 && near && hero.state !== "dead" && foeSees(e)) Object.assign(e, { state: "wind", st: 0 });
}

export function updateSporegnat(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, -e.face * 16, 200 * dt);
    e.vy = approach(e.vy, -18, 200 * dt);
    if (fxRng.chance(0.35 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-2, 2), e.y + 3, 0, 14, 0.3, { col: GNAT.sac[3], size: 0.5 });
    if (e.st >= GNAT_TIMES.rise * waveScale(game.wave).windup) startSwoop(e);
  } else if (e.state === "dive") {
    swoop(e);
    return;
  } else if (e.st >= GNAT_TIMES.recover)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, GNAT_MOVE.top, GROUND - 10);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-2, 2), e.y + 3, fxRng.range(-3, 3), fxRng.range(6, 12), 0.6, {
      col: GNAT.sac[2],
      size: 0.5,
    });
}
