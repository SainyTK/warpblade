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
import { SKY_SPARKS } from "../colors";

export const FINCH_HITS = { swoop: 6 } as const;
export const FINCH_SWOOP = { windup: 0.5, speed: 150, most: 0.7, recover: 0.6, floor: GROUND - 6 } as const;
const HOVER = { wide: 28, height: 42, speed: 70, reach: 70 } as const;

function hover(e: Enemy, dt: number): void {
  const a = game.t * 2.2 * e.side + e.seed * 5;
  const tx = hero.x + Math.cos(a) * HOVER.wide;
  const ty = hero.y - HOVER.height + Math.sin(a * 2) * 6;
  e.vx = approach(e.vx, clamp((tx - e.x) * 2.4, -HOVER.speed, HOVER.speed), 260 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2.4, -HOVER.speed, HOVER.speed), 260 * dt);
  if (Math.abs(e.vx) > 6) e.face = Math.sign(e.vx);
  const near = Math.abs(hero.x - e.x) < HOVER.reach;
  if (e.cd > 0 || !near || !foeSees(e) || hero.state === "dead") return;
  Object.assign(e, { state: "wind", st: 0, n: 0, ax: hero.x, ay: hero.y - 12 });
  e.face = Math.sign(hero.x - e.x) || e.face;
  sfx.chime(6);
}

function windUp(e: Enemy, dt: number, windup: number): void {
  if (e.st < windup * 0.6) {
    e.ax = hero.x;
    e.ay = hero.y - 12;
    e.face = Math.sign(hero.x - e.x) || e.face;
  }
  e.vx = approach(e.vx, -e.face * 12, 260 * dt);
  e.vy = approach(e.vy, -14, 260 * dt);
  if (e.st < windup) return;
  const dx = e.ax - e.x;
  const dy = Math.max(10, e.ay - e.y);
  const len = Math.hypot(dx, dy) || 1;
  Object.assign(e, { state: "dive", st: 0, vx: (dx / len) * FINCH_SWOOP.speed, vy: (dy / len) * FINCH_SWOOP.speed });
  sfx.swing(1.8);
}

function swoop(e: Enemy, dt: number): void {
  e.vy -= 160 * dt;
  eachStanding(() => {
    if (e.n > 0 || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(FINCH_HITS.swoop * e.power, e.x - Math.sign(e.vx) * 6);
  });
  if (fxRng.chance(0.4))
    particles.spawn(PK.STREAK, e.x, e.y, -e.vx * 0.2, -e.vy * 0.2, 0.14, { col: SKY_SPARKS.feather[1], size: 1 });
  if (e.st < FINCH_SWOOP.most && e.y < FINCH_SWOOP.floor) return;
  Object.assign(e, { state: "recover", st: 0, vy: -40 });
}

export function updateSquallfinch(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") windUp(e, dt, FINCH_SWOOP.windup * scale.windup);
  else if (e.state === "dive") swoop(e, dt);
  else {
    e.vx = approach(e.vx, 0, 140 * dt);
    e.vy = approach(e.vy, -30, 160 * dt);
    if (e.st >= FINCH_SWOOP.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.4, 2.4) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, 16, FINCH_SWOOP.floor);
  if (fxRng.chance(0.03 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-4, 4), e.y + 3, fxRng.range(-4, 4), 10, 0.5, {
      col: SKY_SPARKS.feather[2],
      size: 0.5,
    });
}
