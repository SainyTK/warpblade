import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT, BLIGHT_SPARKS } from "../../colors";

export const CRAWLER_HITS = { roll: 14, touch: 6 } as const;
export const ROLL = { speed: 150, reach: 170, shake: 0.75, recover: 1.05, unroll: 0.3, armor: 0.4 } as const;
const WALK_SPEED = 22;
const NOTICE = 140;

export const rolling = (e: Enemy): boolean => e.state === "lunge";

export function crawlerTakes(e: Enemy, dmg: number, loud: boolean): number {
  if (!rolling(e) || !loud) return dmg;
  for (let i = 0; i < 4; i++)
    particles.spawn(PK.SPARK, e.x, e.y - 8, fxRng.range(-60, 60), -fxRng.range(30, 90), fxRng.range(0.15, 0.3), {
      sparks: BLIGHT_SPARKS.shell,
    });
  return dmg * ROLL.armor;
}

function bonk(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, vx: -e.face * 50 });
  shake(0.12, 1.5);
  sfx.block();
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * 6,
      GROUND - fxRng.range(3, 12),
      -e.face * fxRng.range(30, 90),
      -fxRng.range(40, 110),
      fxRng.range(0.4, 0.7),
      { col: fxRng.pick(BLIGHT.shell.slice(2)), size: fxRng.range(1.2, 2) },
    );
}

function startRoll(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, ax: e.x, n: 0, vx: e.face * ROLL.speed });
  sfx.lunge();
  dust(e.x, GROUND, 5, -e.face);
}

export function updateRotcrawler(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") {
    turnToHero(e, dt);
    const moving = (Math.abs(dx) > 10 || !foeSees(e)) && e.halt <= 0;
    e.vx = approach(e.vx, moving ? e.face * WALK_SPEED : 0, 180 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < NOTICE && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (Math.floor(e.st * 8) !== Math.floor((e.st - dt) * 8)) dust(e.x + fxRng.range(-6, 6), GROUND, 1);
    if (e.pinned > 0) e.st = Math.min(e.st, ROLL.shake * windup * 0.9);
    if (e.st >= ROLL.shake * windup) startRoll(e);
  } else if (e.state === "lunge" && (e.pinned > 0 || (e.st > 0.05 && e.vx === 0))) {
    bonk(e);
  } else if (e.state === "lunge") {
    e.vx = e.face * ROLL.speed;
    if (fxRng.chance(0.5 * ts)) dust(e.x - e.face * 6, GROUND, 1, -e.face);
    eachStanding(() => {
      if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
        e.n = 1;
        hurtHero(CRAWLER_HITS.roll * e.power, e.x - e.face * 10);
      }
    });
    const wall = (e.face < 0 && e.x <= stageLeft() + 10) || (e.face > 0 && e.x >= stageRight() - 10);
    if (wall) bonk(e);
    else if (Math.abs(e.x - e.ax) >= ROLL.reach) Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.4 });
  } else if (e.st >= ROLL.recover * windup) {
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown });
  }
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), e.y - fxRng.range(8, 13), 0, -8, fxRng.range(0.5, 0.9), {
      col: BLIGHT.spore[2],
      size: 0.5,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(CRAWLER_HITS.touch * e.power, e.x);
  });
}
