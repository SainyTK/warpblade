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
import { approach, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { ROOTCALLER_SPARKS } from "./colors";
import { ROOTCALLER, ROOTCALLER_HITS } from "./constants";
import { eruptRoots } from "./roots";
import { callSlimes, mayCall } from "./summons";

export const raiseTime = (): number => ROOTCALLER.raise * waveScale(game.wave).windup;
export const callTime = (): number => ROOTCALLER.call * waveScale(game.wave).windup;
export const warded = (e: Enemy): boolean => e.state === "summon";
export const staffFootX = (e: Enemy): number => e.x + e.face * 13;

function gather(x: number, y: number, chance: number): void {
  if (!fxRng.chance(chance)) return;
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, x + Math.cos(a) * 10, y + Math.sin(a) * 10, -Math.cos(a) * 34, -Math.sin(a) * 34, 0.3, {
    col: fxRng.pick(ROOTCALLER_SPARKS.rift),
    size: 0.5,
  });
}

function keepDistance(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  let want = 0;
  if (!foeSees(e)) want = e.face * ROOTCALLER.pace;
  else if (gap < ROOTCALLER.near) want = -e.face * ROOTCALLER.pace;
  else if (gap > ROOTCALLER.far) want = e.face * ROOTCALLER.pace;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 120 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e) || !facesHero(e)) return;
  if (mayCall(e)) {
    Object.assign(e, { state: "summon", st: 0, n: 0, vx: 0 });
    sfx.cast();
    return;
  }
  if (gap < ROOTCALLER.reach) Object.assign(e, { state: "wind", st: 0, vx: 0 });
}

function raise(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  gather(e.x + e.face * 6, e.y - 46, dt * 30);
  if (e.st < raiseTime()) return;
  const target = clampStageX(hero.x, 8);
  Object.assign(e, { state: "shoot", st: 0, ax: target });
  eruptRoots(staffFootX(e), target, ROOTCALLER_HITS.roots * e.power);
  dust(staffFootX(e), GROUND, 6);
  sfx.swingHeavy(0.8);
}

function plunge(e: Enemy): void {
  e.vx = 0;
  if (e.st >= ROOTCALLER.mark + ROOTCALLER.stand) Object.assign(e, { state: "recover", st: 0, n: 0 });
}

function stuck(e: Enemy): void {
  e.vx = 0;
  const done = e.n === 1 ? ROOTCALLER.callRest : ROOTCALLER.stuck + ROOTCALLER.pull;
  if (e.st < done) return;
  if (e.n === 0) dust(staffFootX(e), GROUND, 3);
  Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown });
}

function summon(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  gather(e.x, e.y - 50, dt * 40);
  if (e.n === 0 && e.st >= callTime() * ROOTCALLER.callAt) {
    e.n = 1;
    callSlimes(e);
    sfx.chime(1);
  }
  if (e.st >= callTime()) Object.assign(e, { state: "recover", st: 0, n: 1 });
}

export function updateRootcaller(e: Enemy, dt: number): void {
  if (e.state === "walk") keepDistance(e, dt);
  else if (e.state === "wind") raise(e, dt);
  else if (e.state === "shoot") plunge(e);
  else if (e.state === "summon") summon(e, dt);
  else stuck(e);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(ROOTCALLER_HITS.touch * e.power, e.x);
  });
}
