import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE_SPARKS } from "../../colors";
import { createQuake } from "./quake";

export const HULK_HITS = { quake: 20, jab: 16, touch: 8 } as const;
export const HULK_TIMES = { raise: 1.05, slam: 0.3, vent: 1.5, coil: 0.6, jab: 0.22, reset: 0.75 } as const;
const HULK_MOVE = { pace: 15, jab: 30, quake: 70, half: 46, jabReach: 30 } as const;

export const venting = (e: Enemy): boolean => e.state === "recover" && e.n === 1;

function steam(e: Enemy, n: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SMOKE,
      e.x + fxRng.range(-8, 8),
      e.y - fxRng.range(14, 26),
      fxRng.range(-14, 14),
      -fxRng.range(14, 30),
      0.8,
      {
        col: 0x5a4a46,
        size: fxRng.range(1.5, 3),
      },
    );
}

function choose(e: Enemy): void {
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  const gap = Math.abs(hero.x - e.x);
  if (gap < HULK_MOVE.jab && rng.chance(0.5)) {
    Object.assign(e, { state: "charge", st: 0 });
    sfx.swing(0.6);
  } else if (gap < HULK_MOVE.quake) {
    const mark = HULK_TIMES.raise * waveScale(game.wave).windup;
    Object.assign(e, { state: "wind", st: 0 });
    game.fx.push(createQuake(e, { x: e.x, half: HULK_MOVE.half, mark, damage: HULK_HITS.quake * e.power }));
    sfx.swing(0.4);
  }
}

function slam(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  shake(0.16, 2);
  sfx.boom();
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SPARK,
      e.x + e.face * 10,
      GROUND - 2,
      fxRng.range(-120, 120),
      -fxRng.range(60, 160),
      fxRng.range(0.2, 0.5),
      {
        sparks: FORGE_SPARKS.molten,
      },
    );
}

function jab(e: Enemy): void {
  Object.assign(e, { state: "shoot", st: 0 });
  const front = e.x + e.face * 6;
  const reach = e.x + e.face * HULK_MOVE.jabReach;
  const box = [Math.min(front, reach), GROUND - 28, Math.max(front, reach), GROUND - 8] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(HULK_HITS.jab * e.power, e.x);
  });
  sfx.hit(true, 0.6);
}

export function updateAnvilhulk(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const far = Math.abs(hero.x - e.x) > 20 || !foeSees(e);
    e.vx = approach(e.vx, far && e.halt <= 0 ? e.face * HULK_MOVE.pace : 0, 100 * dt);
    choose(e);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.5 * ts)) steam(e, 1);
    if (e.st >= HULK_TIMES.raise * scale.windup) slam(e);
  } else if (e.state === "swipe") {
    if (e.st >= HULK_TIMES.slam) {
      Object.assign(e, { state: "recover", st: 0, n: 1 });
      steam(e, 6);
    }
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_TIMES.coil * scale.windup) jab(e);
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, e.face * 30, 600 * dt);
    if (e.st >= HULK_TIMES.jab) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else {
    if (venting(e) && fxRng.chance(0.5 * ts)) steam(e, 1);
    const rest = venting(e) ? HULK_TIMES.vent : HULK_TIMES.reset;
    if (e.st >= rest) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.2, 2) * scale.cooldown });
  }
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(HULK_HITS.touch * e.power, e.x);
  });
}
