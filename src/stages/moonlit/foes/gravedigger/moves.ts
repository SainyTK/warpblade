import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { DIRT_BITS } from "../graveColors";
import { freshStrike, reachBox, strikeOnce, touchHero } from "../strike";

export const DIGGER = {
  pace: 18,
  near: 16,
  swingReach: 24,
  scoopReach: 50,
  raise: 0.6,
  dig: 0.55,
  swing: 0.22,
  fling: 0.3,
  recover: 0.75,
} as const;
export const DIGGER_HITS = { swing: 14, fling: 11, touch: 6 } as const;
export const SWING = 0;
export const SCOOP = 1;

export const raiseTime = (e: Enemy): number =>
  (e.n === SWING ? DIGGER.raise : DIGGER.dig) * waveScale(game.wave).windup;

function shamble(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const lurch = 0.5 + 0.5 * Math.abs(Math.sin(game.t * 3.4 + e.seed));
  const want = foeSees(e) && Math.abs(dx) > DIGGER.near ? e.face * DIGGER.pace * lurch : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 160 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead" || Math.abs(hero.y - e.y) > 30) return;
  if (Math.abs(dx) < DIGGER.swingReach) Object.assign(e, { state: "wind", st: 0, n: SWING });
  else if (Math.abs(dx) < DIGGER.scoopReach) Object.assign(e, { state: "wind", st: 0, n: SCOOP });
}

function windUp(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.n === SCOOP && fxRng.chance(dt * 16))
    particles.spawn(PK.DUST, e.x + e.face * 10, GROUND - 1, e.face * fxRng.range(4, 20), -fxRng.range(10, 30), 0.4, {
      col: fxRng.pick(DIRT_BITS),
      size: fxRng.range(1, 2),
    });
  if (e.st < raiseTime(e)) return;
  freshStrike(e);
  Object.assign(e, { state: e.n === SWING ? "swipe" : "volley", st: 0, vx: e.face * (e.n === SWING ? 40 : 10) });
  sfx.swing(e.n === SWING ? 0.6 : 0.8);
  if (e.n === SCOOP) spray(e);
}

function spray(e: Enemy): void {
  dust(e.x + e.face * 10, GROUND, 4, e.face);
  for (let i = 0; i < 22; i++)
    particles.spawn(
      PK.DUST,
      e.x + e.face * fxRng.range(8, 14),
      GROUND - fxRng.range(2, 8),
      e.face * fxRng.range(60, 170),
      -fxRng.range(30, 110),
      fxRng.range(0.35, 0.6),
      { col: fxRng.pick(DIRT_BITS), size: fxRng.range(1, 2.4) },
    );
}

function strike(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 260 * dt);
  if (e.state === "swipe") {
    if (e.st < DIGGER.swing * 0.7) strikeOnce(e, reachBox(e, 2, 24, -28, -2), DIGGER_HITS.swing * e.power);
    if (e.st >= DIGGER.swing) Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  if (e.st < DIGGER.fling * 0.7) strikeOnce(e, reachBox(e, 8, 46, -16, 0), DIGGER_HITS.fling * e.power);
  if (e.st >= DIGGER.fling) Object.assign(e, { state: "recover", st: 0 });
}

export function updateGravedigger(e: Enemy, dt: number): void {
  if (e.state === "walk") shamble(e, dt);
  else if (e.state === "wind") windUp(e, dt);
  else if (e.state === "swipe" || e.state === "volley") strike(e, dt);
  else {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= DIGGER.recover)
      Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, DIGGER_HITS.touch * e.power);
}
