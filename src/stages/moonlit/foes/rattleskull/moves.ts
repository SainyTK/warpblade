import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GHOST_EMBERS } from "../graveColors";
import { freshStrike, reachBox, strikeOnce, touchHero } from "../strike";

export const SKULL = { pace: 34, reach: 38, chatter: 0.45, leap: 0.36, leapSpeed: 150, arc: 12, recover: 0.6 } as const;
export const SKULL_HITS = { bite: 7, touch: 5 } as const;

export const chatterTime = (): number => SKULL.chatter * waveScale(game.wave).windup;

function skitter(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const hop = Math.abs(Math.sin(game.t * 9 + e.seed));
  const want = foeSees(e) && Math.abs(dx) > 10 ? e.face * SKULL.pace * (0.4 + hop) : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 240 * dt);
  const close = Math.abs(dx) < SKULL.reach && Math.abs(hero.y - e.y) < 24;
  if (e.cd <= 0 && close && facesHero(e) && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0, vx: 0 });
}

function chatter(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  if (fxRng.chance(dt * 12))
    particles.spawn(PK.EMBER, e.x + e.face * 3, e.y - 7, fxRng.range(-6, 6), -fxRng.range(8, 18), 0.35, {
      sparks: GHOST_EMBERS,
    });
  if (e.st < chatterTime()) return;
  freshStrike(e);
  Object.assign(e, { state: "lunge", st: 0, vx: e.face * SKULL.leapSpeed });
  sfx.swing(1.6);
}

function leap(e: Enemy): void {
  const u = clamp(e.st / SKULL.leap);
  e.y = GROUND - Math.sin(Math.PI * u) * SKULL.arc;
  strikeOnce(e, reachBox(e, -2, 7, -10, 0), SKULL_HITS.bite * e.power);
  if (u < 1) return;
  e.y = GROUND;
  dust(e.x, GROUND, 3);
  Object.assign(e, { state: "recover", st: 0 });
}

export function updateRattleskull(e: Enemy, dt: number): void {
  if (e.state === "walk") skitter(e, dt);
  else if (e.state === "wind") chatter(e, dt);
  else if (e.state === "lunge") leap(e);
  else {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= SKULL.recover)
      Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "lunge") e.y = GROUND;
  if (e.state === "walk") touchHero(e, SKULL_HITS.touch * e.power);
}
