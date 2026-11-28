import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { VEIL } from "../colors";
import { RAY, RAY_HITS } from "./constants";
import { createAuroraCurtain } from "./curtain";

function trail(e: Enemy): void {
  particles.spawn(PK.MOTE, e.x - e.face * 10, e.y + fxRng.range(-2, 2), -e.face * 12, fxRng.range(-4, 4), 0.6, {
    col: fxRng.pick([VEIL.aurora[2], VEIL.aurora[3], VEIL.veil[2]]),
    size: 0.6,
  });
}

function glide(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  const tx = hero.x + Math.sin(game.t * 0.7 + e.seed) * 60;
  const ty = hero.y - RAY.height + Math.sin(game.t * 1.8 + e.seed) * 6;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -RAY.glide, RAY.glide), 120 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -40, 40), 140 * dt);
  if (Math.abs(e.vx) > 6) e.face = Math.sign(e.vx);
  if (e.cd <= 0 && Math.abs(dx) < RAY.notice && hero.state !== "dead" && foeSees(e)) {
    const x = clampStageX(hero.x, 10);
    Object.assign(e, { state: "wind", st: 0, ax: x });
    game.fx.push(createAuroraCurtain(x, RAY.mark * waveScale(game.wave).windup, RAY_HITS.curtain * e.power));
    sfx.chime(1);
  }
}

export function updateAuroraray(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") glide(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, clamp((e.ax - e.x) * 2, -50, 50), 160 * dt);
    e.vy = approach(e.vy, -20, 120 * dt);
    if (e.st >= RAY.mark * scale.windup) Object.assign(e, { state: "shoot", st: 0 });
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= RAY.fall) Object.assign(e, { state: "recover", st: 0 });
  } else {
    const ty = GROUND - RAY.low;
    e.vx = approach(e.vx, 0, 100 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 2, -30, 50), 160 * dt);
    if (e.st >= RAY.tired) Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.6, 2.4) * scale.cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 14, GROUND - 18);
  if (fxRng.chance(0.25 * ts)) trail(e);
  eachStanding(() => {
    if (e.state === "recover" && boxHit(enemyBox(e), heroBox()) && e.n === 0) {
      e.n = 1;
      hurtHero(RAY_HITS.tail * e.power, e.x);
    }
  });
  if (e.state !== "recover") e.n = 0;
}
