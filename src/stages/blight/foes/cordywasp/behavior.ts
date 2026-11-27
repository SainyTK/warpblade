import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { WASP } from "./colors";
import { createSporeDart } from "./dart";
import { dive, startDive } from "./dive";
import { BULB, DART, WASP_HITS, WASP_MOVE, WASP_TIMES } from "./moves";

export const bulbAt = (e: Enemy): [number, number] => [e.x + e.face * BULB.x, e.y + BULB.y];

function gather(e: Enemy): void {
  const [bx, by] = bulbAt(e);
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, bx + Math.cos(a) * 9, by + Math.sin(a) * 9, -Math.cos(a) * 30, -Math.sin(a) * 30, 0.3, {
    col: WASP.bulb[3],
    size: 0.5,
  });
}

function volley(e: Enemy): void {
  const [bx, by] = bulbAt(e);
  const aim = Math.atan2(hero.y - 12 - by, hero.x - bx);
  for (let i = 0; i < DART.count; i++) {
    const angle = aim + (i - (DART.count - 1) / 2) * DART.spread;
    game.fx.push(createSporeDart(bx, by, angle, WASP_HITS.dart * e.power));
  }
  sfx.swing(0.6);
  Object.assign(e, { state: "shoot", st: 0, vx: -e.face * 30 });
}

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const bob = Math.sin(game.t * 3.1 + e.seed) * 4;
  const tx = hero.x - e.side * WASP_MOVE.keep + Math.sin(game.t * 0.8 + e.seed) * 10;
  const ty = hero.y - WASP_MOVE.hover + bob;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -80, 80), 220 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -60, 60), 220 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e)) return;
  if (Math.abs(dx) < WASP_MOVE.close) Object.assign(e, { state: "charge", st: 0 });
  else if (Math.abs(dx) < WASP_MOVE.reach) Object.assign(e, { state: "wind", st: 0 });
}

function rest(e: Enemy): void {
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateCordywasp(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (fxRng.chance(0.6 * ts)) gather(e);
    if (e.st >= WASP_TIMES.swell * windup) volley(e);
  } else if (e.state === "shoot") {
    if (e.st >= WASP_TIMES.shot) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.vx = approach(e.vx, -e.face * 40, 300 * dt);
    e.vy = approach(e.vy, -34, 300 * dt);
    if (fxRng.chance(0.4 * ts)) gather(e);
    if (e.st >= WASP_TIMES.rear * windup) startDive(e);
  } else if (e.state === "dive") {
    dive(e, dt);
    e.x = clampStageX(e.x, 10);
    return;
  } else {
    e.vy = approach(e.vy, -20, 120 * dt);
    if (e.st >= WASP_TIMES.recover) rest(e);
  }
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, WASP_MOVE.top, GROUND - 12);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.MOTE, e.x - e.face * 10, e.y + 6, fxRng.range(-3, 3), fxRng.range(5, 12), 0.7, {
      col: WASP.bulb[2],
      size: 0.5,
    });
}
