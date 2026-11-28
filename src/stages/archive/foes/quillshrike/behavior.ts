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
import { createDiveMark } from "./aim";
import { QUILLSHRIKE, QUILLSHRIKE_HITS } from "./moves";
import { splashDown } from "./splash";

const STUCK_Y = GROUND - QUILLSHRIKE.tip;
const struck = new WeakSet<Enemy>();

function steer(e: Enemy, tx: number, ty: number, dt: number): void {
  e.vx = approach(e.vx, clamp((tx - e.x) * 2.6, -QUILLSHRIKE.pace, QUILLSHRIKE.pace), 260 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2.6, -QUILLSHRIKE.pace, QUILLSHRIKE.pace), 260 * dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 14);
}

function circle(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x + e.side * QUILLSHRIKE.side + Math.sin(game.t * 1.1 + e.seed) * 8;
  const ty = hero.y - QUILLSHRIKE.hover + Math.sin(game.t * 2 + e.seed) * 5;
  steer(e, tx, ty, dt);
  if (e.cd <= 0 && hero.state !== "dead" && foeSees(e)) {
    Object.assign(e, { state: "wind", st: 0, ax: hero.x });
    game.fx.push(createDiveMark(e, QUILLSHRIKE.wind * waveScale(game.wave).windup));
    sfx.swing(0.6);
  }
}

function aim(e: Enemy, dt: number, ts: number): void {
  const windup = QUILLSHRIKE.wind * waveScale(game.wave).windup;
  if (e.st < windup * QUILLSHRIKE.lock) e.ax = clampStageX(approach(e.ax, hero.x, 120 * dt), 12);
  e.face = Math.sign(e.ax - e.x) || e.face;
  e.vx = approach(e.vx, 0, 200 * dt);
  e.vy = approach(e.vy, -16, 200 * dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 14);
  if (fxRng.chance(0.5 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), e.y + fxRng.range(-6, 6), 0, 10, 0.3, {
      col: FOE.letter,
      size: 0.5,
    });
  if (e.pinned > 0) e.st = Math.min(e.st, windup * 0.9);
  if (e.st < windup) return;
  const dx = e.ax - e.x;
  const dy = STUCK_Y - e.y;
  const len = Math.hypot(dx, dy) || 1;
  Object.assign(e, { state: "dive", st: 0, vx: (dx / len) * QUILLSHRIKE.speed, vy: (dy / len) * QUILLSHRIKE.speed });
  struck.delete(e);
  sfx.swing(1.3);
}

function dive(e: Enemy, dt: number, ts: number): void {
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y += e.vy * dt;
  if (fxRng.chance(0.8 * ts))
    particles.spawn(PK.MOTE, e.x - Math.sign(e.vx) * 4, e.y - 6, 0, 0, 0.3, { col: FOE.ink[3], size: 0.8 });
  eachStanding(() => {
    if (struck.has(e) || !boxHit(enemyBox(e), heroBox())) return;
    struck.add(e);
    hurtHero(QUILLSHRIKE_HITS.dive * e.power, e.x);
  });
  if (e.y < STUCK_Y) return;
  e.y = STUCK_Y;
  Object.assign(e, { state: "recover", st: 0, vx: 0, vy: 0 });
  splashDown(e);
}

export function updateQuillshrike(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") circle(e, dt);
  else if (e.state === "wind") aim(e, dt, ts);
  else if (e.state === "dive") dive(e, dt, ts);
  else if (e.state === "recover") {
    e.y = STUCK_Y;
    if (e.st >= QUILLSHRIKE.stuck) {
      Object.assign(e, { state: "leap", st: 0, vy: -70 });
      sfx.swing(1.6);
    }
  } else {
    e.vy = approach(e.vy, -80, 260 * dt);
    e.y = clamp(e.y + e.vy * dt, 20, GROUND - 14);
    if (e.st >= QUILLSHRIKE.rise)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
}
