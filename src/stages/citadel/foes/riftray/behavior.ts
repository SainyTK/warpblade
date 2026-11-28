import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { strikeOnceBy } from "../strike";
import { RAY, RAY_HITS, RAY_MOVE } from "./constants";
import { createRiftDrop } from "./drop";
import { createDropMark } from "./dropMark";

const windOf = (e: Enemy): number =>
  (e.ay === RAY_MOVE.drop ? RAY.dropWind : RAY.swoopWind) * waveScale(game.wave).windup;

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * RAY.hover + Math.sin(game.t * 0.8 + e.seed) * 8;
  const ty = Math.min(hero.y, GROUND) - RAY.height + Math.sin(game.t * 1.7 + e.seed) * 4;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -50, 50), 160 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -45, 45), 160 * dt);
  if (e.cd > 0 || Math.abs(dx) > RAY.reach || hero.state === "dead" || !foeSees(e)) return;
  const move = Math.abs(dx) < RAY.under ? RAY_MOVE.drop : RAY_MOVE.swoop;
  Object.assign(e, { state: "wind", st: 0, ay: move, n: 0 });
  if (move === RAY_MOVE.drop) game.fx.push(createDropMark(e, windOf(e)));
  sfx.chime(1);
}

function release(e: Enemy): void {
  if (e.ay === RAY_MOVE.drop) {
    Object.assign(e, { state: "beam", st: 0 });
    game.fx.push(createRiftDrop(e, RAY_HITS.drop * e.power));
    sfx.cast();
    return;
  }
  const low = clamp(hero.y - 14, e.y + 10, GROUND - 8);
  Object.assign(e, { state: "dive", st: 0, n: 0, ax: e.x, ay: e.y, side: low });
  sfx.lunge();
}

function swoop(e: Enemy): void {
  const u = clamp(e.st / RAY.swoopTime);
  const x = e.ax + e.face * RAY.swoopRun * u;
  const y = e.ay + (e.side - e.ay) * Math.sin(u * Math.PI);
  e.vx = (x - e.x) * 60;
  e.vy = 0;
  e.x = clampStageX(x, 12);
  e.y = y;
  strikeOnceBy(e, enemyBox(e), RAY_HITS.swoop * e.power);
  if (u >= 1) Object.assign(e, { state: "recover", st: 0, vx: e.face * 30, vy: -20, side: rng.chance(0.5) ? 1 : -1 });
}

export function updateRiftray(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, e.ay === RAY_MOVE.swoop ? -e.face * 16 : 0, 200 * dt);
    e.vy = approach(e.vy, e.ay === RAY_MOVE.swoop ? -14 : 0, 200 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-8, 8), e.y + 3, 0, fxRng.range(8, 20), 0.3, {
        col: VOID_SPARKS[1],
        size: 0.6,
      });
    if (e.st >= windOf(e)) release(e);
  } else if (e.state === "dive") {
    swoop(e);
    return;
  } else if (e.state === "beam") {
    e.vx = approach(e.vx, 0, 300 * dt);
    e.vy = approach(e.vy, 0, 300 * dt);
    if (e.st >= RAY.dropTime) Object.assign(e, { state: "recover", st: 0, side: rng.chance(0.5) ? 1 : -1 });
  } else {
    e.vy = approach(e.vy, -10, 100 * dt);
    if (e.st >= RAY.recover) Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.3, 2.1) * scale.cooldown });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 16, GROUND - 8);
  if (fxRng.chance(0.12 * ts))
    particles.spawn(PK.EMBER, e.x - e.face * 16, e.y + 2, -e.face * 6, fxRng.range(2, 10), 0.5, {
      sparks: VOID_SPARKS,
    });
}
