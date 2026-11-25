import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { createDiveLine } from "./diveLine";

export const HAWK_HITS = { dive: 14 } as const;
export const HAWK_DIVE = { windup: 0.75, track: 0.55, speed: 235, most: 1.2, recover: 0.95, floor: GROUND - 5 };
const CIRCLE = { wide: 46, tall: 16, height: 66, pace: 1.5, speed: 95, reach: 120 } as const;

function aim(e: Enemy): void {
  const tx = hero.x;
  const ty = hero.y - 12;
  const dx = tx - e.x;
  const dy = Math.max(12, ty - e.y);
  const k = (HAWK_DIVE.floor - e.y) / dy;
  e.ax = clampStageX(e.x + dx * k, 8);
  e.ay = HAWK_DIVE.floor;
  e.face = Math.sign(e.ax - e.x) || e.face;
}

function circle(e: Enemy, dt: number): void {
  const a = game.t * CIRCLE.pace * e.side + e.seed * 3;
  const cx = hero.x + Math.cos(a) * CIRCLE.wide;
  const cy = hero.y - CIRCLE.height + Math.sin(a) * CIRCLE.tall;
  e.vx = approach(e.vx, clamp((cx - e.x) * 2.2, -CIRCLE.speed, CIRCLE.speed), 280 * dt);
  e.vy = approach(e.vy, clamp((cy - e.y) * 2, -70, 70), 240 * dt);
  if (Math.abs(e.vx) > 8) e.face = Math.sign(e.vx);
}

function windUp(e: Enemy, dt: number, scale: number): void {
  if (e.st < HAWK_DIVE.windup * scale * HAWK_DIVE.track) aim(e);
  const back = -Math.sign(e.ax - e.x) || -e.face;
  e.vx = approach(e.vx, back * 14, 260 * dt);
  e.vy = approach(e.vy, -16, 260 * dt);
  if (fxRng.chance(dt * 18))
    particles.spawn(PK.SPARK, e.x + fxRng.range(-10, 10), e.y + fxRng.range(-6, 2), 0, -fxRng.range(10, 30), 0.2, {
      sparks: SKY_SPARKS.volt,
    });
  if (e.st < HAWK_DIVE.windup * scale) return;
  const dx = e.ax - e.x;
  const dy = e.ay - e.y;
  const len = Math.hypot(dx, dy) || 1;
  Object.assign(e, { state: "dive", st: 0, n: 0, vx: (dx / len) * HAWK_DIVE.speed, vy: (dy / len) * HAWK_DIVE.speed });
  sfx.lunge();
}

function dive(e: Enemy): void {
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(HAWK_HITS.dive * e.power, e.x - Math.sign(e.vx) * 8);
    }
  });
  if (fxRng.chance(0.5))
    particles.spawn(PK.STREAK, e.x - e.vx * 0.04, e.y - e.vy * 0.04, -e.vx * 0.2, -e.vy * 0.2, 0.18, {
      col: SKY_SPARKS.copper[1],
      size: 1,
    });
  if (e.y < HAWK_DIVE.floor && e.st < HAWK_DIVE.most) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.25, vy: -50 });
  dust(e.x, GROUND, 5, Math.sign(e.vx));
  shake(0.08, 1);
}

export function updateGalehawk(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") {
    circle(e, dt);
    const near = Math.abs(hero.x - e.x) < CIRCLE.reach;
    if (e.cd <= 0 && near && foeSees(e) && hero.state !== "dead") {
      Object.assign(e, { state: "wind", st: 0 });
      aim(e);
      game.fx.push(createDiveLine(e, HAWK_DIVE.windup * scale.windup));
      sfx.swing(1.4);
    }
  } else if (e.state === "wind") windUp(e, dt, scale.windup);
  else if (e.state === "dive") dive(e);
  else {
    e.vx = approach(e.vx, 0, 120 * dt);
    e.vy = approach(e.vy, -34, 160 * dt);
    if (e.st >= HAWK_DIVE.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.5, 2.6) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, 16, HAWK_DIVE.floor);
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-8, 8), e.y + fxRng.range(-2, 4), fxRng.range(-6, 6), 12, 0.6, {
      col: SKY_SPARKS.copper[0],
      size: 0.5,
    });
}
