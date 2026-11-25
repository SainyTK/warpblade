import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageWalls } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";

export const GUARD_HITS = { thrust: 17 } as const;
export const THRUST = {
  windup: 0.62,
  step: 150,
  stepTime: 0.13,
  live: 0.16,
  recover: 0.8,
  reach: 46,
  near: 52,
} as const;
const MARCH = { speed: 26, keep: 34, back: 18 } as const;

function reachOf(e: Enemy): number {
  let reach: number = THRUST.reach;
  for (const wall of stageWalls()) {
    if (wall.y > e.y - 12) continue;
    const near = e.face > 0 ? wall.x0 - e.x : e.x - wall.x1;
    if (near >= 0 && near < reach) reach = near;
  }
  return reach;
}

function thrustBox(e: Enemy): readonly [number, number, number, number] {
  const tip = e.x + e.face * reachOf(e);
  return e.face > 0 ? [e.x + 4, e.y - 24, tip, e.y - 12] : [tip, e.y - 24, e.x - 4, e.y - 12];
}

function thrust(e: Enemy, dt: number): void {
  if (e.st < THRUST.stepTime) e.vx = e.face * THRUST.step;
  else e.vx = approach(e.vx, 0, 900 * dt);
  if (e.n > 0 || e.st > THRUST.live) return;
  eachStanding(() => {
    if (e.n > 0 || !boxHit(thrustBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(GUARD_HITS.thrust * e.power, e.x);
  });
}

export function updateSkyguard(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const far = Math.abs(dx) > MARCH.keep;
    const close = Math.abs(dx) < MARCH.back && foeSees(e);
    const goal = e.halt > 0 ? 0 : !foeSees(e) || far ? e.face * MARCH.speed : close ? -e.face * MARCH.speed * 0.6 : 0;
    e.vx = approach(e.vx, goal, 160 * dt);
    const level = Math.abs(hero.y - e.y) < 34 && reachOf(e) > Math.abs(dx) - 4;
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < THRUST.near && level && hero.state !== "dead") {
      Object.assign(e, { state: "wind", st: 0, n: 0 });
      sfx.swing(0.7);
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 10, 300 * dt);
    if (fxRng.chance(dt * 10))
      particles.spawn(PK.SPARK, e.x - e.face * 10, e.y - 19, 0, -fxRng.range(10, 30), 0.2, {
        sparks: SKY_SPARKS.volt,
      });
    if (e.st >= THRUST.windup * scale.windup) {
      Object.assign(e, { state: "lunge", st: 0, n: 0 });
      dust(e.x, GROUND, 4, -e.face);
      sfx.lunge();
    }
  } else if (e.state === "lunge") {
    thrust(e, dt);
    if (e.st >= THRUST.stepTime + 0.12) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= THRUST.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.9) * scale.cooldown });
  if (e.state === "recover") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.04 * ts))
    particles.spawn(PK.SPARK, e.x + e.face * 6, e.y - fxRng.range(14, 22), 0, -8, 0.3, { sparks: SKY_SPARKS.volt });
}
