import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { createSporeRain } from "./rain";
import { roomForPuffs, shakeLoosePuffs } from "./summon";
import { BLOAT_HITS, BLOAT_MOVE, BLOAT_TIMES } from "./timing";

const GILLS_Y = 3;

export const rainTime = (): number => BLOAT_TIMES.rain * waveScale(game.wave).windup;

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const bob = Math.sin(game.t * 1.4 + e.seed) * 4;
  const tx = hero.x - e.side * BLOAT_MOVE.side + Math.sin(game.t * 0.6 + e.seed) * 10;
  const ty = hero.y - BLOAT_MOVE.hover + bob;
  e.vx = approach(e.vx, clamp((tx - e.x) * 0.8, -BLOAT_MOVE.drift, BLOAT_MOVE.drift), 60 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 0.9, -BLOAT_MOVE.drift, BLOAT_MOVE.drift), 70 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e)) return;
  if (e.n % 3 === 2 && roomForPuffs(e)) {
    Object.assign(e, { state: "summon", st: 0 });
    sfx.chime(0.4);
  } else if (Math.abs(dx) < BLOAT_MOVE.reach) startRain(e);
}

function startRain(e: Enemy): void {
  const x = clampStageX(hero.x, 12);
  const floor = surfaceBelow(x, hero.y - 2);
  Object.assign(e, { state: "wind", st: 0, ax: x });
  game.fx.push(
    createSporeRain({
      x,
      top: e.y + GILLS_Y,
      floor,
      mark: rainTime(),
      damage: BLOAT_HITS.rain * e.power,
      puddle: BLOAT_HITS.puddle * e.power,
    }),
  );
  sfx.swing(0.4);
}

function gather(e: Enemy, ts: number): void {
  if (!fxRng.chance(0.6 * ts)) return;
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, e.x + Math.cos(a) * 16, e.y + 2 + Math.sin(a) * 5, -Math.cos(a) * 26, 6, 0.35, {
    col: BLIGHT.spore[3],
    size: 0.5,
  });
}

function shedSpores(e: Enemy, ts: number, rate: number): void {
  if (fxRng.chance(rate * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-12, 12), e.y + 4, fxRng.range(-4, 4), fxRng.range(10, 24), 0.8, {
      col: fxRng.pick(BLIGHT.spore),
      size: 0.5,
    });
}

function rest(e: Enemy): void {
  Object.assign(e, {
    state: "drift",
    st: 0,
    n: e.n + 1,
    cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateBloatcap(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, clamp((e.ax - e.x) * 1.2, -16, 16), 80 * dt);
    e.vy = approach(e.vy, 0, 80 * dt);
    gather(e, ts);
    if (e.st >= rainTime()) Object.assign(e, { state: "shoot", st: 0 });
  } else if (e.state === "shoot") {
    e.vy = approach(e.vy, -10, 120 * dt);
    shedSpores(e, ts, 1);
    if (e.st >= BLOAT_TIMES.fall) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 60 * dt);
    e.vy = approach(e.vy, 0, 60 * dt);
    shedSpores(e, ts, 0.6);
    if (e.st >= BLOAT_TIMES.summon * waveScale(game.wave).windup) {
      shakeLoosePuffs(e);
      Object.assign(e, { state: "recover", st: 0 });
    }
  } else {
    e.vy = approach(e.vy, 4, 30 * dt);
    if (e.st >= BLOAT_TIMES.recover) rest(e);
  }
  e.vx -= e.vx * 1.2 * dt;
  e.vy -= e.vy * 1.2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 16);
  e.y = clamp(e.y + e.vy * dt, BLOAT_MOVE.top, GROUND - BLOAT_MOVE.low);
  shedSpores(e, ts, 0.05);
}
