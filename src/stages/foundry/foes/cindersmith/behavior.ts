import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, lights, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE, FORGE_SPARKS } from "../../colors";
import { createBreath } from "./breath";
import { createIngot } from "./ingot";
import { createMoltenDrop } from "./moltenRain";
import { createShockwave, createSlamMark } from "./shockwave";
import { slaglingsAlive, spawnFromAnvil } from "./summon";

export const SMITH_HITS = { slam: 22, shock: 16, ingot: 14, breath: 18, rain: 14, touch: 10 } as const;
export const SMITH_TIMES = {
  slam: 0.95,
  quickSlam: 0.42,
  smash: 0.45,
  volley: 0.75,
  throw: 0.4,
  warm: 0.9,
  burn: 1.05,
  summon: 0.85,
  roar: 0.9,
  crack: 1.5,
  recover: 0.95,
  hurried: 0.6,
} as const;
export const SMITH_ENRAGE = 0.5;
export const SMITH_POINTS = { hammer: 30, mouthX: 16, mouthY: 60, anvil: 30, hand: 58 } as const;
const SMITH_MOVE = { walk: 20, near: 58, keep: 46 } as const;
const RAIN = { drops: 8, beat: 0.09, mark: 0.85, spread: 26 } as const;

type Attack = "slam" | "ingots" | "breath" | "summon" | "rain";
const lastAttack = new WeakMap<Enemy, Attack>();

const enraged = (e: Enemy): boolean => e.phase >= 2;

function pickAttack(e: Enemy): Attack {
  const near = Math.abs(hero.x - e.x) < SMITH_MOVE.near;
  const weights: [Attack, number][] = near
    ? [
        ["slam", 4],
        ["breath", 3.5],
        ["summon", slaglingsAlive() < 2 ? 1.5 : 0],
        ["rain", enraged(e) ? 2 : 0],
        ["ingots", 0.8],
      ]
    : [
        ["ingots", 4],
        ["slam", 3],
        ["summon", slaglingsAlive() < 2 ? 2 : 0],
        ["rain", enraged(e) ? 3 : 0],
        ["breath", 0.6],
      ];
  const last = lastAttack.get(e);
  const open = weights.filter(([a, w]) => a !== last && w > 0);
  const total = open.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng.range(0, total);
  for (const [attack, w] of open) {
    roll -= w;
    if (roll <= 0) return attack;
  }
  return open[0]?.[0] ?? "slam";
}

function startAttack(e: Enemy, attack: Attack): void {
  lastAttack.set(e, attack);
  const windup = waveScale(game.wave).windup;
  if (attack === "slam") {
    Object.assign(e, { state: "charge", st: 0, n: 0 });
    game.fx.push(createSlamMark(e, SMITH_POINTS.hammer));
  }
  if (attack === "ingots") Object.assign(e, { state: "volley", st: 0 });
  if (attack === "summon") Object.assign(e, { state: "summon", st: 0 });
  if (attack === "rain") Object.assign(e, { state: "hop", st: 0 });
  if (attack === "breath") {
    Object.assign(e, { state: "wind", st: 0 });
    game.fx.push(
      createBreath(e, {
        x: e.x + e.face * SMITH_POINTS.mouthX,
        y: e.y - SMITH_POINTS.mouthY,
        dir: e.face,
        warm: SMITH_TIMES.warm * windup,
        burn: SMITH_TIMES.burn,
        damage: SMITH_HITS.breath * e.power,
      }),
    );
  }
  sfx.swing(0.4);
}

function smash(e: Enemy): void {
  const head = e.x + e.face * SMITH_POINTS.hammer;
  Object.assign(e, { state: "swipe", st: 0 });
  const box = [Math.min(e.x, head) - 6, GROUND - 26, Math.max(e.x, head) + 6, GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(SMITH_HITS.slam * e.power, e.x);
  });
  game.fx.push(createShockwave(head, 1, SMITH_HITS.shock * e.power));
  game.fx.push(createShockwave(head, -1, SMITH_HITS.shock * e.power));
  dust(head, GROUND, 8);
  for (let i = 0; i < 20; i++)
    particles.spawn(PK.SPARK, head, GROUND - 2, fxRng.range(-160, 160), -fxRng.range(80, 220), fxRng.range(0.3, 0.6), {
      sparks: FORGE_SPARKS.molten,
    });
  lights.add(head, GROUND - 6, 50, FORGE.molten[3], 0.7, 0.3);
  shake(0.3, 4);
  sfx.boom();
}

function throwIngots(e: Enemy): void {
  Object.assign(e, { state: "shoot", st: 0 });
  const count = enraged(e) ? 4 : 3;
  for (let i = 0; i < count; i++) {
    const spread = (i - (count - 1) / 2) * 30;
    const tx = clampStageX(hero.x + spread + hero.vx * 0.3, 10);
    game.fx.push(
      createIngot(e.x + e.face * 8, e.y - SMITH_POINTS.hand, tx, 0.8 + i * 0.12, SMITH_HITS.ingot * e.power),
    );
  }
  sfx.swing(0.7);
}

function callRain(e: Enemy): void {
  Object.assign(e, { state: "recover", st: -0.3 });
  const left = stageLeft() + 14;
  const right = stageRight() - 14;
  const xs = [hero.x];
  for (let i = 1; i < RAIN.drops; i++)
    xs.push(left + ((right - left) * (i - 0.5 + rng.range(-0.3, 0.3))) / (RAIN.drops - 1));
  xs.forEach((x, i) => {
    game.fx.push(createMoltenDrop(clampStageX(x, 10), RAIN.mark + i * RAIN.beat, SMITH_HITS.rain * e.power));
  });
  for (let i = 0; i < 16; i++)
    particles.spawn(PK.SPARK, e.x, e.y - 70, fxRng.range(-60, 60), -fxRng.range(120, 260), fxRng.range(0.4, 0.8), {
      sparks: FORGE_SPARKS.molten,
    });
  shake(0.4, 2);
  sfx.thunder();
}

function crackArmor(e: Enemy): void {
  Object.assign(e, { state: "burrow", st: 0, phase: 2, vx: 0 });
  for (let i = 0; i < 26; i++)
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-14, 14),
      e.y - fxRng.range(20, 48),
      fxRng.range(-160, 160),
      -fxRng.range(60, 200),
      fxRng.range(0.6, 1.1),
      {
        col: fxRng.pick(FORGE.iron),
        size: fxRng.range(1.5, 3),
      },
    );
  lights.add(e.x, e.y - 34, 90, FORGE.molten[3], 0.9, 0.8);
  shake(0.5, 4);
  sfx.boom();
}

function rest(e: Enemy): number {
  return (enraged(e) ? SMITH_TIMES.hurried : SMITH_TIMES.recover) * waveScale(game.wave).cooldown;
}

export function updateCindersmith(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const windup = waveScale(game.wave).windup;
  const calm = e.state === "walk" || e.state === "recover";
  if (calm && e.phase < 2 && e.hp <= e.max * SMITH_ENRAGE) crackArmor(e);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const far = Math.abs(dx) > SMITH_MOVE.keep;
    e.vx = approach(e.vx, far && e.halt <= 0 ? e.face * SMITH_MOVE.walk * (enraged(e) ? 1.3 : 1) : 0, 120 * dt);
    if (Math.floor(e.st * 1.6) !== Math.floor((e.st - dt) * 1.6) && Math.abs(e.vx) > 4) {
      dust(e.x + e.face * 8, GROUND, 3);
      shake(0.06, 1);
    }
    if (e.cd <= 0 && hero.state !== "dead" && foeSees(e)) startAttack(e, pickAttack(e));
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 300 * dt);
    const wind = (e.n > 0 ? SMITH_TIMES.quickSlam : SMITH_TIMES.slam) * windup;
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.EMBER, e.x - e.face * 10, e.y - 82, fxRng.range(-10, 10), -10, 0.4, {
        sparks: FORGE_SPARKS.molten,
      });
    if (e.st >= wind) smash(e);
  } else if (e.state === "swipe") {
    if (e.st >= SMITH_TIMES.smash) {
      if (enraged(e) && e.n === 0) {
        Object.assign(e, { state: "charge", st: 0, n: 1 });
        turnToHero(e, 1);
        game.fx.push(createSlamMark(e, SMITH_POINTS.hammer));
      } else Object.assign(e, { state: "recover", st: 0 });
    }
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= SMITH_TIMES.volley * windup) throwIngots(e);
  } else if (e.state === "shoot") {
    if (e.st >= SMITH_TIMES.throw) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= SMITH_TIMES.warm * windup) Object.assign(e, { state: "beam", st: 0 });
  } else if (e.state === "beam") {
    if (e.st >= SMITH_TIMES.burn) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= SMITH_TIMES.summon * windup) {
      spawnFromAnvil(e.x - e.face * SMITH_POINTS.anvil, -e.face);
      shake(0.2, 2);
      sfx.block();
      Object.assign(e, { state: "recover", st: 0 });
    }
  } else if (e.state === "hop") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= SMITH_TIMES.roar * windup) callRain(e);
  } else if (e.state === "burrow") {
    if (e.st >= SMITH_TIMES.crack) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= rest(e)) Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.2, 0.6) });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 18);
  e.y = GROUND;
  if (fxRng.chance((enraged(e) ? 0.5 : 0.15) * ts))
    particles.spawn(
      PK.EMBER,
      e.x + fxRng.range(-10, 10),
      e.y - fxRng.range(24, 44),
      fxRng.range(-6, 6),
      -14,
      fxRng.range(0.4, 0.9),
      {
        sparks: FORGE_SPARKS.ember,
      },
    );
  eachStanding(() => {
    if (e.state === "walk" && boxHit(enemyBox(e), heroBox())) hurtHero(SMITH_HITS.touch * e.power, e.x);
  });
}
