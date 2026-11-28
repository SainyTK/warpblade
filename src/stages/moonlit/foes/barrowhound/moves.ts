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
import { FIRE_MOTES } from "../graveColors";
import { freshStrike, reachBox, strikeOnce, touchHero } from "../strike";
import { HOUND, HOUND_HITS, POUNCE, SNAP, windTime } from "./pose";
import { createPounceTell } from "./pounceTell";

function prowl(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const gap = Math.abs(dx);
  let want = 0;
  if (!foeSees(e)) want = e.face * HOUND.pace * 0.5;
  else if (gap > HOUND.keep + 10) want = e.face * HOUND.pace;
  else if (gap < HOUND.keep - 24) want = -e.face * HOUND.pace * 0.6;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 200 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead" || Math.abs(hero.y - e.y) > 40) return;
  if (gap < HOUND.snapReach) Object.assign(e, { state: "wind", st: 0, n: SNAP });
  else if (gap < HOUND.sense) {
    Object.assign(e, { state: "wind", st: 0, n: POUNCE, ax: clampStageX(hero.x + e.face * HOUND.past, 12) });
    game.fx.push(createPounceTell(e));
  }
}

function crouch(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  if (e.n === POUNCE && e.st < windTime(e) * 0.6) e.ax = clampStageX(hero.x + e.face * HOUND.past, 12);
  if (fxRng.chance(dt * 10))
    particles.spawn(PK.EMBER, e.x + e.face * 12, e.y - 12, fxRng.range(-6, 6), -fxRng.range(6, 14), 0.3, {
      sparks: FIRE_MOTES,
    });
  if (e.st < windTime(e)) return;
  freshStrike(e);
  if (e.n === SNAP) {
    Object.assign(e, { state: "swipe", st: 0, vx: e.face * 70 });
    sfx.swing(1.2);
    return;
  }
  Object.assign(e, { state: "charge", st: 0, vx: e.face * HOUND.pounceSpeed });
  dust(e.x, GROUND, 4, -e.face);
  sfx.lunge();
}

function pounce(e: Enemy): void {
  const u = clamp(e.st / HOUND.pounce);
  e.y = GROUND - Math.sin(Math.PI * u) * HOUND.hop;
  strikeOnce(e, reachBox(e, -4, 16, -16, 0), HOUND_HITS.pounce * e.power);
  const passed = (e.x - e.ax) * e.face >= 0;
  if (u < 1 && !passed) return;
  e.y = GROUND;
  Object.assign(e, { state: "recover", st: 0 });
  dust(e.x, GROUND, 6, e.face);
}

function snap(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 500 * dt);
  strikeOnce(e, reachBox(e, 2, 20, -15, -2), HOUND_HITS.snap * e.power);
  if (e.st >= HOUND.snap) Object.assign(e, { state: "recover", st: 0 });
}

function skid(e: Enemy, dt: number): void {
  const long = e.n === POUNCE;
  e.vx = approach(e.vx, 0, (long ? 260 : 400) * dt);
  if (long && Math.abs(e.vx) > 30 && fxRng.chance(dt * 30)) dust(e.x - e.face * 4, GROUND, 1, e.face);
  if (e.st >= (long ? HOUND.skid : HOUND.rest))
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown });
}

export function updateBarrowhound(e: Enemy, dt: number): void {
  if (e.state === "walk") prowl(e, dt);
  else if (e.state === "wind") crouch(e, dt);
  else if (e.state === "charge") pounce(e);
  else if (e.state === "swipe") snap(e, dt);
  else skid(e, dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "charge") e.y = GROUND;
  if (e.state === "walk") touchHero(e, HOUND_HITS.touch * e.power);
}
