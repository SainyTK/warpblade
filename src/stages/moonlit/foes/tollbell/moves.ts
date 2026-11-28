import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MOON_MOTES } from "../graveColors";
import { freshStrike, reachBox, strikeOnce } from "../strike";
import { mendAround } from "./mend";
import { BELL, BELL_HITS, DROP, TOLL, windTime } from "./pose";
import { createToll, createTollTell } from "./toll";

const LIP = 9;

function hang(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * BELL.drift;
  const ty = hero.y - BELL.hover + Math.sin(game.t * 0.9 + e.seed) * 4;
  e.vx = approach(e.vx, clamp((tx - e.x) * 0.9, -30, 30), 80 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1, -30, 30), 80 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e) || Math.abs(dx) > BELL.sense) return;
  if (Math.abs(dx) < BELL.below && hero.y > e.y + 30) Object.assign(e, { state: "wind", st: 0, n: DROP });
  else {
    Object.assign(e, { state: "wind", st: 0, n: TOLL });
    game.fx.push(createTollTell(e));
  }
}

function ring(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 120 * dt);
  e.vy = approach(e.vy, 0, 120 * dt);
  if (e.n === DROP && fxRng.chance(dt * 20))
    particles.spawn(PK.DUST, e.x + fxRng.range(-6, 6), e.y - 12, 0, fxRng.range(10, 30), 0.4, {
      col: fxRng.pick(MOON_MOTES),
      size: 0.8,
    });
  if (e.st < windTime(e)) return;
  if (e.n === DROP) {
    freshStrike(e);
    Object.assign(e, { state: "dive", st: 0, vx: 0, vy: BELL.drop * 0.3 });
    sfx.swing(0.4);
    return;
  }
  game.fx.push(createToll(e.x, e.y + 4, BELL.reach, BELL_HITS.toll * e.power));
  mendAround(e, BELL.reach);
  Object.assign(e, { state: "beam", st: 0 });
  sfx.chime(0);
  sfx.boom();
}

function fall(e: Enemy, dt: number): void {
  e.vy = approach(e.vy, BELL.drop, 900 * dt);
  e.y += e.vy * dt;
  strikeOnce(e, reachBox(e, -LIP, LIP, -6, LIP), BELL_HITS.drop * e.power);
  if (e.y < GROUND - LIP) return;
  e.y = GROUND - LIP;
  dust(e.x, GROUND, 10);
  sfx.boom();
  Object.assign(e, { state: "recover", st: 0, vy: 0, n: DROP });
}

function dizzy(e: Enemy, dt: number): void {
  const grounded = e.n === DROP;
  e.vx = approach(e.vx, 0, 80 * dt);
  if (grounded) e.vy = 0;
  else e.vy = approach(e.vy, clamp((hero.y - BELL.sag - e.y) * 1.2, -20, 30), 90 * dt);
  if (e.st >= (grounded ? BELL.grounded : BELL.dizzy))
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(2.2, 3) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
}

export function updateTollbell(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hang(e, dt);
  else if (e.state === "wind") ring(e, dt);
  else if (e.state === "dive") {
    fall(e, dt);
    return;
  } else if (e.state === "beam") {
    if (e.st >= BELL.toll) Object.assign(e, { state: "recover", st: 0, n: TOLL });
  } else dizzy(e, dt);
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, BELL.top, GROUND - LIP);
  if (fxRng.chance(0.04 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-3, 3), e.y + 8, 0, 10, 0.5, { col: fxRng.pick(MOON_MOTES), size: 0.5 });
}
