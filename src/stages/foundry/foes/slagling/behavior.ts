import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE_SPARKS } from "../../colors";
import { isSmall } from "./size";

export const SLAG_HITS = { leap: 13, touch: 6 } as const;
export const SLAG_TIMES = { wind: 0.55, leap: 0.42, recover: 0.6 } as const;
const SLAG_MOVE = { creep: 28, smallCreep: 40, reach: 84, height: 18, least: 26, most: 74 } as const;

function startLeap(e: Enemy): void {
  const distance = clamp(Math.abs(hero.x - e.x), SLAG_MOVE.least, SLAG_MOVE.most);
  Object.assign(e, { state: "lunge", st: 0, n: 0, ax: e.x, vx: (e.face * distance) / SLAG_TIMES.leap });
  sfx.lunge();
  dust(e.x, GROUND, 3, -e.face);
}

function land(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, ay: 0, vx: e.vx * 0.2 });
  dust(e.x, GROUND, 4);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, e.x, GROUND - 2, fxRng.range(-90, 90), -fxRng.range(40, 120), fxRng.range(0.2, 0.45), {
      sparks: FORGE_SPARKS.molten,
    });
}

export function updateSlagling(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const small = isSmall(e);
  const windup = waveScale(game.wave).windup * (small ? 0.75 : 1);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const pulse = 0.55 + 0.45 * Math.abs(Math.sin((game.t + e.seed) * 3.5));
    const creep = (small ? SLAG_MOVE.smallCreep : SLAG_MOVE.creep) * pulse;
    e.vx = approach(e.vx, (Math.abs(dx) > 8 || !foeSees(e)) && e.halt <= 0 ? e.face * creep : 0, 220 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < SLAG_MOVE.reach && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.EMBER, e.x + fxRng.range(-6, 6), e.y - fxRng.range(4, 12), 0, -20, 0.4, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.pinned > 0) e.st = Math.min(e.st, SLAG_TIMES.wind * windup * 0.9);
    if (e.st >= SLAG_TIMES.wind * windup) startLeap(e);
  } else if (e.state === "lunge") {
    const u = clamp(e.st / SLAG_TIMES.leap);
    e.ay = 4 * SLAG_MOVE.height * u * (1 - u) * (small ? 0.7 : 1);
    eachStanding(() => {
      if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
        e.n = 1;
        hurtHero(SLAG_HITS.leap * e.power * (small ? 0.6 : 1), e.x - e.face * 6);
      }
    });
    if (u >= 1 || e.pinned > 0) land(e);
  } else if (e.st >= SLAG_TIMES.recover * (small ? 0.7 : 1))
    Object.assign(e, { state: "walk", st: 0, ay: 0, cd: rng.range(1, 1.8) * waveScale(game.wave).cooldown });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = GROUND;
  if (e.state !== "lunge") e.ay = 0;
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-5, 5), e.y - fxRng.range(4, 10), 0, -12, fxRng.range(0.4, 0.8), {
      sparks: FORGE_SPARKS.ember,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(SLAG_HITS.touch * e.power * (small ? 0.6 : 1), e.x);
  });
}
