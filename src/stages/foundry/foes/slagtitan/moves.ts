import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
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
import { createForgeCrack } from "../forgeguard/crack";

export const TITAN_HITS = { smash: 28, crack: 18, touch: 10 } as const;
export const TITAN_TIMES = { raise: 1.2, smash: 0.35, cool: 1.6, stoke: 0.95, belch: 0.3, spent: 1.1 } as const;
const TITAN_MOVE = { pace: 12, reach: 64, smashReach: 34, brood: 2, spawnXp: 0.1, fling: 70 } as const;

export const mawOpen = (e: Enemy): boolean => e.state === "summon" || e.state === "recover";

export const stackTop = (e: Enemy): [number, number] => [e.x - e.face * 12, e.y - 62];

function brood(e: Enemy): number {
  return game.enemies.filter((o) => o.type === "coalmite" && o.hp > 0 && Math.abs(o.x - e.x) < 160).length;
}

function choose(e: Enemy): void {
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e)) return;
  const gap = Math.abs(hero.x - e.x);
  if (brood(e) < TITAN_MOVE.brood && (gap >= TITAN_MOVE.reach || rng.chance(0.35))) {
    Object.assign(e, { state: "summon", st: 0, n: 0 });
    sfx.bossRoar();
    return;
  }
  if (gap >= TITAN_MOVE.reach || !facesHero(e)) return;
  const mark = TITAN_TIMES.raise * waveScale(game.wave).windup;
  Object.assign(e, { state: "wind", st: 0 });
  for (const dir of [-1, 1])
    game.fx.push(createForgeCrack(e, { x: e.x, dir, mark, damage: TITAN_HITS.crack * e.power }));
  sfx.swingHeavy(0.5);
}

function smash(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const front = e.x + e.face * 6;
  const reach = e.x + e.face * TITAN_MOVE.smashReach;
  const box = [Math.min(front, reach), GROUND - 34, Math.max(front, reach), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(TITAN_HITS.smash * e.power, e.x);
  });
  const at = e.x + e.face * 18;
  dust(at, GROUND, 10);
  for (let i = 0; i < 18; i++)
    particles.spawn(PK.SPARK, at, GROUND - 2, fxRng.range(-140, 140), -fxRng.range(70, 200), fxRng.range(0.25, 0.6), {
      sparks: FORGE_SPARKS.molten,
    });
  shake(0.25, 3);
  sfx.boom();
}

function belch(e: Enemy): void {
  for (const lean of [0.6, 1.2]) {
    const x = clampStageX(e.x + e.face * 14, 10);
    const mite = summonFoe("coalmite", x, GROUND, TITAN_MOVE.spawnXp);
    mite.vx = e.face * TITAN_MOVE.fling * lean;
    mite.face = e.face;
    mite.cd = 1;
    game.enemies.push(mite);
  }
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SPARK,
      e.x + e.face * 8,
      e.y - 30,
      e.face * fxRng.range(20, 120),
      -fxRng.range(20, 100),
      fxRng.range(0.2, 0.5),
      {
        sparks: FORGE_SPARKS.molten,
      },
    );
  sfx.boom();
}

function smoke(e: Enemy, hot: boolean): void {
  const [x, y] = stackTop(e);
  particles.spawn(PK.SMOKE, x + fxRng.range(-1, 1), y, fxRng.range(-6, 6), -fxRng.range(16, 30), 1.1, {
    col: 0x2a201e,
    size: fxRng.range(2, 3.5),
  });
  if (hot) particles.spawn(PK.FIRE, x, y, fxRng.range(-6, 6), -fxRng.range(20, 40), 0.35, { size: 2 });
}

export function updateSlagtitan(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (fxRng.chance((mawOpen(e) || e.state === "wind" ? 0.6 : 0.15) * ts)) smoke(e, e.state === "wind");
  if (e.state === "walk") {
    turnToHero(e, dt);
    const far = Math.abs(hero.x - e.x) > 24 || !foeSees(e);
    e.vx = approach(e.vx, far && e.halt <= 0 ? e.face * TITAN_MOVE.pace : 0, 80 * dt);
    choose(e);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= TITAN_TIMES.raise * scale.windup) smash(e);
  } else if (e.state === "swipe") {
    if (e.st >= TITAN_TIMES.smash) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.6 * ts))
      particles.spawn(PK.EMBER, e.x + e.face * 6 + fxRng.range(-5, 5), e.y - 30, 0, -20, 0.4, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.n === 0 && e.st >= TITAN_TIMES.stoke * scale.windup) {
      e.n = 1;
      belch(e);
    }
    if (e.st >= TITAN_TIMES.stoke * scale.windup + TITAN_TIMES.belch)
      Object.assign(e, { state: "recover", st: 0, n: 1 });
  } else if (e.st >= (e.n === 1 ? TITAN_TIMES.spent : TITAN_TIMES.cool))
    Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.4, 2.2) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(TITAN_HITS.touch * e.power, e.x);
  });
}
