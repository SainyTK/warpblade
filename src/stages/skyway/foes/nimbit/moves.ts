import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
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

export const NIMBIT_HITS = { hop: 6 } as const;
export const NIMBIT_HOP = { windup: 0.45, near: 30, speed: 105, rise: 120, gravity: 520, recover: 0.5 } as const;
const AMBLE = { speed: 30 } as const;

function amble(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const goal = e.halt > 0 ? 0 : e.face * AMBLE.speed * (0.75 + 0.25 * Math.sin(game.t * 7 + e.seed));
  e.vx = approach(e.vx, goal, 200 * dt);
  const level = Math.abs(hero.y - e.y) < 30;
  const near = Math.abs(hero.x - e.x) < NIMBIT_HOP.near;
  if (e.cd > 0 || !facesHero(e) || !near || !level || hero.state === "dead") return;
  Object.assign(e, { state: "wind", st: 0, n: 0 });
  sfx.chime(5);
}

function windUp(e: Enemy, dt: number, windup: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (fxRng.chance(dt * 14))
    particles.spawn(PK.SPARK, e.x + fxRng.range(-3, 3), e.y - 13, 0, -fxRng.range(10, 24), 0.18, {
      sparks: SKY_SPARKS.volt,
    });
  if (e.st < windup) return;
  Object.assign(e, { state: "hop", st: 0, n: 0, vx: e.face * NIMBIT_HOP.speed, vy: -NIMBIT_HOP.rise });
  sfx.jump();
}

function hop(e: Enemy, dt: number): void {
  e.vy += NIMBIT_HOP.gravity * dt;
  e.y += e.vy * dt;
  eachStanding(() => {
    if (e.n > 0 || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(NIMBIT_HITS.hop * e.power, e.x);
  });
  if (e.y < GROUND) return;
  e.y = GROUND;
  Object.assign(e, { state: "recover", st: 0, vy: 0, vx: e.vx * 0.3 });
  dust(e.x, GROUND, 3, 0);
}

export function updateNimbit(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") amble(e, dt);
  else if (e.state === "wind") windUp(e, dt, NIMBIT_HOP.windup * scale.windup);
  else if (e.state === "hop") hop(e, dt);
  else {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= NIMBIT_HOP.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.8) * scale.cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  if (e.state !== "hop") e.y = GROUND;
  if (fxRng.chance(0.03 * ts) && foeSees(e))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-5, 5), e.y - fxRng.range(4, 10), fxRng.range(-4, 4), -6, 0.6, {
      col: SKY_SPARKS.feather[0],
      size: 0.5,
    });
}
