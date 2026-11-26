import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { createPaperBlade } from "./blade";

export const PAGEWING_HITS = { blade: 9 } as const;
export const PAGEWING_THROW = { wind: 0.55, hold: 0.22, recover: 0.75, speed: 128, spread: 0.2 } as const;
const FLIT = { every: 0.7, height: 30, reach: 52, speed: 90 } as const;

function pickPerch(e: Enemy): void {
  e.ax = e.side * rng.range(18, FLIT.reach);
  e.ay = -FLIT.height + rng.range(-10, 8);
  e.n = 0;
}

function throwBlades(e: Enemy): void {
  const tx = hero.x;
  const ty = hero.y - 16;
  const base = Math.atan2(ty - e.y, tx - e.x);
  const count = e.elite ? 3 : 2;
  for (let i = 0; i < count; i++) {
    const a = base + (i - (count - 1) / 2) * PAGEWING_THROW.spread;
    game.fx.push(
      createPaperBlade(
        e.x + Math.cos(a) * 5,
        e.y + Math.sin(a) * 5,
        Math.cos(a) * PAGEWING_THROW.speed,
        Math.sin(a) * PAGEWING_THROW.speed,
        PAGEWING_HITS.blade * e.power,
      ),
    );
  }
  sfx.swing(1.6);
}

export function updatePagewing(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    e.n += dt;
    if (e.n >= FLIT.every || (e.ax === 0 && e.ay === 0)) pickPerch(e);
    const tx = hero.x + e.ax;
    const ty = clamp(hero.y - 18 + e.ay, 24, GROUND - 26);
    e.vx = approach(e.vx, clamp((tx - e.x) * 3, -FLIT.speed, FLIT.speed), 420 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 3, -FLIT.speed, FLIT.speed), 420 * dt);
    if (e.cd <= 0 && Math.abs(dx) < 110 && hero.state !== "dead" && foeSees(e))
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.face = Math.sign(dx) || e.face;
    e.vx = approach(e.vx, -e.face * 14, 300 * dt);
    e.vy = approach(e.vy, -10, 300 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), e.y + fxRng.range(-4, 4), 0, 0, 0.2, {
        col: FOE.paperGlint,
        size: 0.5,
      });
    if (e.st >= PAGEWING_THROW.wind * waveScale(game.wave).windup) {
      Object.assign(e, { state: "shoot", st: 0, vx: e.face * 30 });
      throwBlades(e);
    }
  } else if (e.state === "shoot") {
    if (e.st >= PAGEWING_THROW.hold) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vy = approach(e.vy, clamp((hero.y - 22 - e.y) * 1.6, -30, 30), 160 * dt);
    if (e.st >= PAGEWING_THROW.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.5, 2.4) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
        n: FLIT.every,
      });
  }
  e.vx -= e.vx * 2.4 * dt;
  e.vy -= e.vy * 2.4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 12);
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.FLAKE, e.x - e.face * 5, e.y + 2, -e.face * 8, 6, 0.8, { col: FOE.paper[2], size: 0.8 });
}
