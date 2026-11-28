import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { FLASH, MARCH, WARD, WARDEN_HITS } from "./constants";
import { createLanternFlash } from "./flash";
import { createFlashMark, flashCenter, flashReaches } from "./flashMark";
import { createWardThreads } from "./threads";
import { castWard, lanternPoint, wardTargets } from "./ward";

const wardReady = new WeakMap<Enemy, number>();

function march(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const goal = e.halt > 0 || (foeSees(e) && gap < MARCH.keep) ? 0 : e.face * MARCH.speed;
  e.vx = approach(e.vx, goal, 120 * dt);
  if (e.cd > 0 || hero.state === "dead") return;
  const scale = waveScale(game.wave);
  if ((wardReady.get(e) ?? 0) <= game.t && wardTargets(e).length > 0) {
    Object.assign(e, { state: "summon", st: 0, n: 0 });
    wardReady.set(e, game.t + WARD.every);
    game.fx.push(createWardThreads(e, WARD.windup * scale.windup));
    sfx.chime(2);
    return;
  }
  if (!facesHero(e) || gap > FLASH.near || Math.abs(hero.y - e.y) > 34) return;
  Object.assign(e, { state: "wind", st: 0, n: 0 });
  game.fx.push(createFlashMark(e, FLASH.windup * scale.windup));
  sfx.swing(0.6);
}

function flash(e: Enemy): void {
  const [cx, cy] = flashCenter(e);
  game.fx.push(createLanternFlash(cx, cy, FLASH.radius));
  sfx.thunder();
  eachStanding(() => {
    if (flashReaches(cx, cy)) hurtHero(WARDEN_HITS.flash * e.power, cx);
  });
}

export function updateLanternwarden(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") march(e, dt);
  else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= WARD.windup * scale.windup) {
      castWard(e);
      sfx.chime(0);
      Object.assign(e, { state: "recover", st: 0, n: 1 });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (fxRng.chance(dt * 14)) {
      const [lx, ly] = lanternPoint(e);
      particles.spawn(PK.SPARK, lx, ly, fxRng.range(-20, 20), fxRng.range(-20, 20), 0.2, { sparks: SKY_SPARKS.volt });
    }
    if (e.st >= FLASH.windup * scale.windup) {
      Object.assign(e, { state: "beam", st: 0 });
      flash(e);
    }
  } else if (e.state === "beam") {
    if (e.st >= FLASH.hold) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else {
    e.vx = approach(e.vx, 0, 200 * dt);
    const rest = e.n > 0 ? WARD.recover : FLASH.recover;
    if (e.n === 0 && fxRng.chance(0.2 * ts)) {
      const [lx, ly] = lanternPoint(e);
      particles.spawn(PK.SMOKE, lx, ly, fxRng.range(-4, 4), -12, 0.8, { size: 0.6 });
    }
    if (e.st >= rest) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.2, 1.9) * scale.cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
}
