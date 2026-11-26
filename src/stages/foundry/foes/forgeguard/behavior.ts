import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE_SPARKS } from "../../colors";
import { createForgeCrack } from "./crack";

export const GUARD_HITS = { smash: 18, crack: 14, touch: 7 } as const;
export const GUARD_TIMES = { wind: 0.95, smash: 0.32, recover: 1.05 } as const;
const GUARD_MOVE = { walk: 17, reach: 44, smashReach: 28, smashHeight: 30 } as const;

function smash(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const front = e.x + e.face * 4;
  const reach = e.x + e.face * GUARD_MOVE.smashReach;
  const box = [Math.min(front, reach), GROUND - GUARD_MOVE.smashHeight, Math.max(front, reach), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(GUARD_HITS.smash * e.power, e.x);
  });
  const head = e.x + e.face * 17;
  dust(head, GROUND, 6);
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, head, GROUND - 2, fxRng.range(-110, 110), -fxRng.range(60, 180), fxRng.range(0.2, 0.5), {
      sparks: FORGE_SPARKS.molten,
    });
  shake(0.18, 2.5);
  sfx.boom();
}

export function updateForgeguard(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const windup = GUARD_TIMES.wind * waveScale(game.wave).windup;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, (Math.abs(dx) > 22 || !foeSees(e)) && e.halt <= 0 ? e.face * GUARD_MOVE.walk : 0, 120 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < GUARD_MOVE.reach && hero.state !== "dead") {
      Object.assign(e, { state: "wind", st: 0 });
      game.fx.push(createForgeCrack(e, { x: e.x, dir: e.face, mark: windup, damage: GUARD_HITS.crack * e.power }));
      sfx.swing(0.5);
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.EMBER, e.x - e.face * 8 + fxRng.range(-2, 2), e.y - 34, fxRng.range(-6, 6), -12, 0.4, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.st >= windup) smash(e);
  } else if (e.state === "swipe") {
    if (e.st >= GUARD_TIMES.smash) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= GUARD_TIMES.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2.1) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(GUARD_HITS.touch * e.power, e.x);
  });
}
