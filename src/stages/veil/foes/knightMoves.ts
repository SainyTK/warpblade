import { GROUND } from "../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../game/adventure";
import { stageWalls } from "../../../game/adventure/trail";
import { eachStanding } from "../../../game/coopHooks";
import { foeSees } from "../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../game/enemies/facing";
import { hurtHero } from "../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../game/state";
import { boxHit, dust, heroBox } from "../../../game/world";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { KNIGHT_HITS, SHARD_SPARKS } from "./knightColors";

export const KNIGHT = {
  walk: 20,
  near: 32,
  sense: 130,
  flicker: 0.62,
  raise: 0.48,
  arrive: 0.34,
  cut: 0.16,
  reach: 30,
  recover: 0.85,
  behind: 22,
} as const;

const BLINK = 1;
const CUT = 0;

export const flickering = (e: Enemy): boolean => e.state === "wind" && e.n === BLINK;
export const raising = (e: Enemy): boolean => (e.state === "wind" && e.n === CUT) || e.state === "charge";
export const flickerTime = (): number => KNIGHT.flicker * waveScale(game.wave).windup;
export const raiseTime = (): number => KNIGHT.raise * waveScale(game.wave).windup;
export const arriveTime = (): number => KNIGHT.arrive * waveScale(game.wave).windup;

function standable(x: number): boolean {
  if (x < stageLeft() + 12 || x > stageRight() - 12) return false;
  return !stageWalls().some((wall) => x > wall.x0 - 10 && x < wall.x1 + 10);
}

function shards(x: number, n: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-6, 6),
      GROUND - fxRng.range(2, 26),
      fxRng.range(-60, 60),
      fxRng.range(-70, 20),
      fxRng.range(0.2, 0.4),
      { sparks: SHARD_SPARKS },
    );
}

function blink(e: Enemy): void {
  const behind = hero.x - hero.face * KNIGHT.behind;
  const front = hero.x + hero.face * KNIGHT.behind;
  const x = standable(behind) ? behind : standable(front) ? front : e.x;
  shards(e.x, 10);
  e.x = x;
  e.face = Math.sign(hero.x - x) || e.face;
  shards(e.x, 12);
  Object.assign(e, { state: "charge", st: 0, vx: 0 });
  sfx.lunge();
}

function cut(e: Enemy): void {
  const reach = e.x + e.face * KNIGHT.reach;
  const box = [Math.min(e.x, reach), e.y - 26, Math.max(e.x, reach), e.y - 2] as const;
  eachStanding(() => {
    if (e.ax || !boxHit(box, heroBox())) return;
    e.ax = 1;
    hurtHero((e.n === BLINK ? KNIGHT_HITS.blinkCut : KNIGHT_HITS.cut) * e.power, e.x);
  });
}

export function updateRiftknight(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    turnToHero(e, dt);
    const go = foeSees(e) && Math.abs(dx) > KNIGHT.near * 0.8;
    e.vx = approach(e.vx, go ? Math.sign(dx) * KNIGHT.walk : 0, 120 * dt);
    const ready = e.cd <= 0 && hero.state !== "dead" && foeSees(e) && facesHero(e);
    if (ready && Math.abs(dx) <= KNIGHT.near && Math.abs(hero.y - e.y) < 26)
      Object.assign(e, { state: "wind", st: 0, n: CUT, vx: 0 });
    else if (ready && Math.abs(dx) < KNIGHT.sense && hero.y > GROUND - 50 && e.st > 0.7 + (e.seed % 0.6))
      Object.assign(e, { state: "wind", st: 0, n: BLINK, vx: 0 });
  } else if (flickering(e)) {
    e.vx = 0;
    if (fxRng.chance(dt * 16)) shards(e.x, 1);
    if (e.st >= flickerTime()) blink(e);
  } else if (e.state === "wind" || e.state === "charge") {
    e.vx = approach(e.vx, 0, 300 * dt);
    const ready = e.state === "charge" ? arriveTime() : raiseTime();
    if (e.st >= ready) {
      Object.assign(e, { state: "swipe", st: 0, ax: 0, n: e.state === "charge" ? BLINK : CUT, vx: e.face * 40 });
      sfx.swing(0.9);
    }
  } else if (e.state === "swipe") {
    cut(e);
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= KNIGHT.cut) {
      Object.assign(e, { state: "recover", st: 0 });
      dust(e.x + e.face * 18, GROUND, 3);
    }
  } else if (e.st >= KNIGHT.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown });
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
}
