import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { RAM } from "./colors";
import { RAM_CHARGE, RAM_HITS, RAM_WALK } from "./constants";

const hornBox = (e: Enemy) =>
  e.face > 0 ? ([e.x + 2, e.y - 20, e.x + 19, e.y - 2] as const) : ([e.x - 19, e.y - 20, e.x - 2, e.y - 2] as const);

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const goal = e.halt > 0 || (foeSees(e) && gap < RAM_WALK.keep) ? 0 : e.face * RAM_WALK.speed;
  e.vx = approach(e.vx, goal, 120 * dt);
  const level = Math.abs(hero.y - e.y) < 30;
  if (e.cd > 0 || !facesHero(e) || gap > RAM_CHARGE.near || !level || hero.state === "dead") return;
  Object.assign(e, { state: "wind", st: 0, n: 0 });
  sfx.swingHeavy(0.8);
}

function windUp(e: Enemy, dt: number, windup: number): void {
  e.vx = approach(e.vx, -e.face * 8, 200 * dt);
  if (fxRng.chance(dt * 9)) dust(e.x + e.face * 6, GROUND, 1, -e.face);
  if (fxRng.chance(dt * 12))
    particles.spawn(PK.SPARK, e.x + e.face * 9, e.y - 18, 0, -fxRng.range(8, 24), 0.18, { sparks: SKY_SPARKS.volt });
  if (e.st < windup) return;
  Object.assign(e, { state: "charge", st: 0, n: 0, vx: e.face * RAM_CHARGE.speed });
  dust(e.x, GROUND, 4, -e.face);
  sfx.lunge();
}

function charge(e: Enemy): void {
  if (e.st > 0.03 && Math.abs(e.vx) < 1) {
    Object.assign(e, { state: "recover", st: 0, n: 1 });
    shake(0.12, 1.2);
    sfx.block();
    return;
  }
  e.vx = e.face * RAM_CHARGE.speed;
  eachStanding(() => {
    if (e.n > 0 || !boxHit(hornBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(RAM_HITS.charge * e.power, e.x);
  });
  if (fxRng.chance(0.5))
    particles.spawn(PK.MOTE, e.x - e.face * 10, e.y - fxRng.range(6, 16), -e.face * 30, -4, 0.35, {
      col: RAM.wool[2],
      size: 0.8,
    });
  if (e.st >= RAM_CHARGE.most) Object.assign(e, { state: "recover", st: 0, n: 0 });
}

export function updateGaleram(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") windUp(e, dt, RAM_CHARGE.windup * scale.windup);
  else if (e.state === "charge") charge(e);
  else {
    e.vx = approach(e.vx, 0, 400 * dt);
    const rest = e.n > 0 ? RAM_CHARGE.bonk : RAM_CHARGE.recover;
    if (e.st >= rest) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.2, 2) * scale.cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  if (fxRng.chance(0.03 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-8, 8), e.y - fxRng.range(8, 18), fxRng.range(-4, 4), -6, 0.7, {
      col: RAM.wool[1],
      size: 0.5,
    });
}
