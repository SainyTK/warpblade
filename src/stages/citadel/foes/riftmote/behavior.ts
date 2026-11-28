import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { strikeOnceBy } from "../strike";
import { MOTE, MOTE_HITS } from "./constants";

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * MOTE.hover + Math.sin(game.t * 1.3 + e.seed) * 10;
  const ty = hero.y - MOTE.height + Math.sin(game.t * 3.1 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -60, 60), 200 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -60, 60), 200 * dt);
  if (e.cd <= 0 && Math.abs(dx) < MOTE.notice && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0, n: 0 });
}

function aim(e: Enemy): void {
  e.ax = hero.x;
  e.ay = Math.min(hero.y - 12, GROUND - 6);
  e.face = Math.sign(e.ax - e.x) || e.face;
}

function dive(e: Enemy): void {
  const dx = e.ax - e.x;
  const dy = e.ay - e.y;
  const d = Math.hypot(dx, dy) || 1;
  e.vx = (dx / d) * MOTE.dive;
  e.vy = (dy / d) * MOTE.dive;
  strikeOnceBy(e, enemyBox(e), MOTE_HITS.dive * e.power);
  if (e.st >= MOTE.diveTime || d < 4 || e.y >= GROUND - 6)
    Object.assign(e, { state: "recover", st: 0, vy: -50, vx: e.vx * 0.4 });
}

export function updateRiftmote(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 20, 200 * dt);
    e.vy = approach(e.vy, -18, 200 * dt);
    if (e.st < MOTE.wind * scale.windup * 0.75) aim(e);
    if (e.st >= MOTE.wind * scale.windup) {
      Object.assign(e, { state: "dive", st: 0, n: 0 });
      sfx.lunge();
    }
  } else if (e.state === "dive") dive(e);
  else {
    e.vy = approach(e.vy, -30, 200 * dt);
    if (e.st >= MOTE.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.2, 2.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  if (e.state !== "dive") {
    e.vx -= e.vx * 2 * dt;
    e.vy -= e.vy * 2 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, 14, GROUND - 6);
  if (fxRng.chance((e.state === "dive" ? 0.7 : 0.12) * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-2, 2), e.y + 2, -e.vx * 0.1, fxRng.range(4, 12), 0.4, {
      sparks: VOID_SPARKS,
    });
}
