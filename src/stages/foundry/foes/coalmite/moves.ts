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

export const MITE_HITS = { hop: 6, touch: 4 } as const;
export const MITE_TIMES = { wind: 0.42, hop: 0.32, recover: 0.45 } as const;
export const MITE_MOVE = { creep: 34, reach: 48, least: 18, most: 44, height: 10 } as const;

function startHop(e: Enemy): void {
  const distance = clamp(Math.abs(hero.x - e.x), MITE_MOVE.least, MITE_MOVE.most);
  Object.assign(e, { state: "lunge", st: 0, n: 0, vx: (e.face * distance) / MITE_TIMES.hop });
  sfx.lunge();
  dust(e.x, GROUND, 2, -e.face);
}

function land(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, ay: 0, vx: e.vx * 0.15 });
  dust(e.x, GROUND, 2);
  for (let i = 0; i < 4; i++)
    particles.spawn(PK.SPARK, e.x, GROUND - 1, fxRng.range(-50, 50), -fxRng.range(30, 70), fxRng.range(0.15, 0.3), {
      sparks: FORGE_SPARKS.ember,
    });
}

function hop(e: Enemy): void {
  const u = clamp(e.st / MITE_TIMES.hop);
  e.ay = 4 * MITE_MOVE.height * u * (1 - u);
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(MITE_HITS.hop * e.power, e.x - e.face * 4);
    }
  });
  if (u >= 1 || e.pinned > 0) land(e);
}

export function updateCoalmite(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    turnToHero(e, dt);
    const skitter = 0.6 + 0.4 * Math.abs(Math.sin((game.t + e.seed) * 9));
    const want = (Math.abs(dx) > 6 || !foeSees(e)) && e.halt <= 0 ? e.face * MITE_MOVE.creep * skitter : 0;
    e.vx = approach(e.vx, want, 260 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < MITE_MOVE.reach && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.EMBER, e.x + fxRng.range(-4, 4), e.y - fxRng.range(3, 7), 0, -16, 0.35, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.pinned > 0) e.st = Math.min(e.st, MITE_TIMES.wind * 0.9);
    if (e.st >= MITE_TIMES.wind * waveScale(game.wave).windup) startHop(e);
  } else if (e.state === "lunge") hop(e);
  else if (e.st >= MITE_TIMES.recover)
    Object.assign(e, { state: "walk", st: 0, ay: 0, cd: rng.range(0.9, 1.5) * waveScale(game.wave).cooldown });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = GROUND;
  if (e.state !== "lunge") e.ay = 0;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(MITE_HITS.touch * e.power, e.x);
  });
}
