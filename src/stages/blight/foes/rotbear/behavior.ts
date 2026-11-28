import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BEAR } from "./colors";
import { BEAR_HITS, BEAR_MOVE, BEAR_TIMES } from "./constants";
import { roar, slam, startHowl, startRear } from "./moves";

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const moving = (gap > 24 || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, moving ? e.face * BEAR_MOVE.walk : 0, 90 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e) || !foeSees(e)) return;
  if (gap < BEAR_MOVE.slamTrigger && rng.chance(0.7)) startRear(e);
  else if (gap < BEAR_MOVE.roarTrigger) startHowl(e);
}

function spores(x: number, y: number): void {
  particles.spawn(PK.MOTE, x + fxRng.range(-4, 4), y, fxRng.range(-6, 6), -fxRng.range(10, 24), 0.5, {
    col: fxRng.pick(BEAR.glow),
    size: 0.5,
  });
}

function rest(e: Enemy): void {
  Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown });
}

export function updateRotbear(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.2 * ts)) spores(e.x - e.face * 4, e.y - 34);
    if (e.pinned > 0) e.st = Math.min(e.st, BEAR_TIMES.rear * windup * 0.9);
    if (e.st >= BEAR_TIMES.rear * windup) slam(e);
  } else if (e.state === "swipe") {
    if (e.st >= BEAR_TIMES.slam) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.2 * ts)) spores(e.x - e.face * 4, e.y - 30);
    if (e.st >= BEAR_TIMES.howl * windup) roar(e);
  } else if (e.state === "shoot") {
    if (e.st >= BEAR_TIMES.roar) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= (e.n === 1 ? BEAR_TIMES.slump : BEAR_TIMES.rest)) rest(e);
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  if (e.state === "walk" && Math.abs(e.vx) > 6 && Math.floor(e.st * 2.6) !== Math.floor((e.st - dt) * 2.6))
    dust(e.x + e.face * 10, GROUND, 1, e.face);
  if (fxRng.chance(0.04 * ts)) spores(e.x - e.face * 6, e.y - 32);
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(BEAR_HITS.touch * e.power, e.x);
  });
}

export const exposed = (e: Enemy): boolean => e.state === "recover" && e.n === 1;
