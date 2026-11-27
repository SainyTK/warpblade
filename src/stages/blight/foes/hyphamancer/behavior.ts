import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { HYPHA, HYPHA_HITS } from "./constants";
import { castRoots, castWard, gather, wardTargets } from "./moves";

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  let want = 0;
  if (!foeSees(e)) want = e.face * HYPHA.pace;
  else if (gap < HYPHA.near) want = -e.face * HYPHA.pace;
  else if (gap > HYPHA.far) want = e.face * HYPHA.pace;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 120 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e) || !foeSees(e)) return;
  if (game.t >= e.ay && wardTargets(e).length) Object.assign(e, { state: "summon", st: 0 });
  else if (gap < HYPHA.reach) {
    Object.assign(e, { state: "wind", st: 0 });
    castRoots(e, hero.x);
  }
}

function rest(e: Enemy, cd: number): void {
  Object.assign(e, { state: "walk", st: 0, cd: cd * waveScale(game.wave).cooldown });
}

export function updateHyphamancer(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "summon") {
    if (fxRng.chance(0.6 * ts)) gather(e, BLIGHT.fungus[3]);
    if (e.st >= HYPHA.raise * windup) {
      castWard(e);
      Object.assign(e, { state: "recover", st: HYPHA.recover * 0.5 });
    }
  } else if (e.state === "wind") {
    if (fxRng.chance(0.6 * ts)) gather(e, BLIGHT.spore[3]);
    if (e.st >= HYPHA.lift * windup) Object.assign(e, { state: "shoot", st: 0 });
  } else if (e.state === "shoot") {
    if (e.st >= HYPHA.plant) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= HYPHA.recover) rest(e, rng.range(1.5, 2.3));
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-10, 12), e.y - fxRng.range(26, 34), 0, 6, 0.9, {
      col: BLIGHT.spore[2],
      size: 0.5,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(HYPHA_HITS.touch * e.power, e.x);
  });
}
