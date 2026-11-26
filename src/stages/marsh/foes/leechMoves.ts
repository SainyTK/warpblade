import { GROUND } from "../../../constants/stage";
import { clampStageX } from "../../../game/adventure";
import { eachStanding, heroSlot } from "../../../game/coopHooks";
import { foeSees } from "../../../game/enemies/awareness";
import { enemyBox } from "../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../game/enemies/facing";
import { hurtHero } from "../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../game/state";
import { boxHit, dust, heroBox } from "../../../game/world";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Box } from "../../../types/world";
import { approach } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { LEECH_HITS, LEECH_SPARKS } from "./leechColors";

export const LEECH = {
  crawl: 22,
  sense: 150,
  near: 30,
  dive: 0.35,
  swim: 105,
  swimMost: 1.5,
  tell: 0.7,
  rear: 0.45,
  erupt: 0.42,
  eruptFrom: 0.05,
  eruptTo: 0.2,
  eruptHeight: 26,
  latch: 1.1,
  drag: 6,
  recover: 0.9,
  lunge: 0.24,
  lungeSpeed: 165,
  fall: 640,
} as const;

const AMBUSH = 1;
const BITE = 0;
const NOWHERE: Box = [0, GROUND + 60, 0, GROUND + 60];

export const buried = (e: Enemy): boolean =>
  (e.state === "burrow" && e.st >= LEECH.dive * 0.6) || (e.state === "wind" && e.n === AMBUSH);
export const erupting = (e: Enemy): boolean => e.state === "lunge" && e.n === AMBUSH;
export const latched = (e: Enemy): boolean => e.state === "swipe";
export const rearing = (e: Enemy): boolean => e.state === "wind" && e.n === BITE;
export const tellTime = (): number => LEECH.tell * waveScale(game.wave).windup;
export const rearTime = (): number => LEECH.rear * waveScale(game.wave).windup;

export function leechBox(e: Enemy): Box {
  if (buried(e)) return NOWHERE;
  if (erupting(e)) return [e.x - 7, e.y - LEECH.eruptHeight, e.x + 7, e.y];
  if (latched(e)) return [e.x - 8, e.y - 9, e.x + 8, e.y + 5];
  if (rearing(e)) return [e.x - 10, e.y - 15, e.x + 10, e.y];
  return [e.x - 12, e.y - 9, e.x + 12, e.y];
}

export function leechCenter(e: Enemy): [number, number] {
  if (buried(e)) return [e.x, e.y - 1];
  if (erupting(e)) return [e.x, e.y - 14];
  if (latched(e)) return [e.x, e.y - 2];
  return [e.x, e.y - 5];
}

function spatter(x: number, n: number, up: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-5, 5),
      GROUND - 1,
      fxRng.range(-70, 70),
      -fxRng.range(up * 0.5, up),
      fxRng.range(0.2, 0.45),
      { sparks: LEECH_SPARKS },
    );
}

function bubble(x: number, chance: number): void {
  if (!fxRng.chance(chance)) return;
  particles.spawn(PK.DUST, x + fxRng.range(-6, 6), GROUND - 1, 0, -fxRng.range(4, 10), 0.4, {
    col: LEECH_SPARKS[0],
    size: fxRng.range(1, 1.8),
  });
}

function crawl(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  turnToHero(e, dt);
  const pace = 0.55 + 0.45 * Math.abs(Math.sin(game.t * 3 + e.seed));
  const moving = foeSees(e) && Math.abs(dx) > LEECH.near * 0.6;
  e.vx = approach(e.vx, moving ? Math.sign(dx) * LEECH.crawl * pace : 0, 200 * dt);
  const ready = e.cd <= 0 && hero.state !== "dead" && foeSees(e);
  if (ready && facesHero(e) && Math.abs(dx) < LEECH.near && Math.abs(hero.y - e.y) < 22) {
    Object.assign(e, { state: "wind", st: 0, n: BITE, vx: 0 });
    return;
  }
  if (ready && Math.abs(dx) < LEECH.sense && hero.y > GROUND - 60 && rng.chance(dt * 1.6)) {
    Object.assign(e, { state: "burrow", st: 0, vx: 0 });
    spatter(e.x + e.face * 6, 6, 110);
    sfx.swing(0.5);
  }
}

function swim(e: Enemy, dt: number): void {
  if (e.st < LEECH.dive) {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(dt * 20)) spatter(e.x + e.face * 6, 1, 80);
    return;
  }
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  e.vx = Math.sign(dx) * Math.min(LEECH.swim, Math.abs(dx) / dt);
  bubble(e.x, dt * 14);
  if (Math.abs(dx) < 3 || e.st > LEECH.dive + LEECH.swimMost) {
    Object.assign(e, { state: "wind", st: 0, n: AMBUSH, vx: 0, ax: e.x });
  }
}

function tell(e: Enemy, dt: number): void {
  e.vx = 0;
  e.x = e.ax;
  bubble(e.x, dt * (10 + 30 * (e.st / tellTime())));
  if (e.st < tellTime()) return;
  Object.assign(e, { state: "lunge", st: 0, ay: 0 });
  spatter(e.x, 12, 190);
  dust(e.x, GROUND, 5);
  sfx.lunge();
}

function bite(e: Enemy, box: Box, damage: number): void {
  eachStanding(() => {
    if (e.ay || !boxHit(box, heroBox())) return;
    e.ay = 1;
    const before = hero.hp;
    hurtHero(damage * e.power, e.x);
    if (hero.hp < before && hero.hp > 0) Object.assign(e, { state: "swipe", st: 0, n: heroSlot(), vx: 0 });
  });
}

function erupt(e: Enemy): void {
  e.vx = 0;
  if (e.st >= LEECH.eruptFrom && e.st <= LEECH.eruptTo)
    bite(e, [e.x - 7, e.y - LEECH.eruptHeight, e.x + 7, e.y], LEECH_HITS.erupt);
  if (e.state === "lunge" && e.st >= LEECH.erupt) Object.assign(e, { state: "recover", st: 0 });
}

function rear(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.st < rearTime()) return;
  Object.assign(e, { state: "lunge", st: 0, n: BITE, ay: 0, vx: e.face * LEECH.lungeSpeed });
  sfx.swing(1.1);
}

function lunge(e: Enemy, dt: number): void {
  const reach = e.x + e.face * 16;
  bite(e, [Math.min(e.x, reach), e.y - 11, Math.max(e.x, reach), e.y - 1], LEECH_HITS.bite);
  e.vx = approach(e.vx, 0, 500 * dt);
  if (e.state === "lunge" && e.st >= LEECH.lunge) Object.assign(e, { state: "recover", st: 0 });
}

function cling(e: Enemy, dt: number): void {
  let held = false;
  eachStanding(() => {
    if (heroSlot() !== e.n) return;
    held = true;
    e.face = hero.face;
    e.x = hero.x - hero.face * 3;
    e.y = Math.min(GROUND, hero.y - 10);
    if (hero.ground) hero.vx -= hero.vx * LEECH.drag * dt;
  });
  if (held && e.st < LEECH.latch && hero.state !== "dead") return;
  Object.assign(e, { state: "recover", st: 0, vy: -60, vx: -e.face * 40 });
}

function rest(e: Enemy, dt: number): void {
  if (e.y < GROUND) {
    e.vy += LEECH.fall * dt;
    e.y = Math.min(GROUND, e.y + e.vy * dt);
    if (e.y >= GROUND) dust(e.x, GROUND, 3);
  }
  e.vx = approach(e.vx, 0, 200 * dt);
  if (e.st >= LEECH.recover && e.y >= GROUND)
    Object.assign(e, { state: "walk", st: 0, vy: 0, cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown });
}

export function updateBogleech(e: Enemy, dt: number): void {
  if (e.state === "walk") crawl(e, dt);
  else if (e.state === "burrow") swim(e, dt);
  else if (e.state === "wind" && e.n === AMBUSH) tell(e, dt);
  else if (e.state === "wind") rear(e, dt);
  else if (erupting(e)) erupt(e);
  else if (e.state === "lunge") lunge(e, dt);
  else if (latched(e)) cling(e, dt);
  else rest(e, dt);
  if (latched(e)) return;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "recover") e.y = GROUND;
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(LEECH_HITS.touch * e.power, e.x);
  });
}
