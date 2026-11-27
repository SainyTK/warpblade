import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { game, hero, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GATOR, GATOR_SUMMON, GATOR_TIMES } from "./constants";
import { beginRushWind, bellow, boglingsAlive, crackle, launchRush, rushDone, rushHits, slam, touch } from "./moves";
import { bellowWindup, rushWindup, slamWindup } from "./timing";

function canBellow(e: Enemy): boolean {
  return e.n >= GATOR.bellowAfter && boglingsAlive() < GATOR_SUMMON.most && rng.chance(GATOR.bellowChance);
}

function choose(e: Enemy): void {
  const gap = Math.abs(hero.x - e.x);
  const behind = Math.sign(hero.x - e.x) === -e.face;
  if (behind && gap < GATOR.near) {
    Object.assign(e, { state: "wind", st: 0, vx: 0, n: e.n + 1 });
    sfx.swing(0.45);
    return;
  }
  if (!facesHero(e) || gap > GATOR.far) return;
  if (canBellow(e)) {
    Object.assign(e, { state: "summon", st: 0, vx: 0, n: 0 });
    return;
  }
  e.n++;
  if (gap < GATOR.near && rng.chance(0.4)) {
    Object.assign(e, { state: "wind", st: 0, vx: 0 });
    sfx.swing(0.45);
    return;
  }
  beginRushWind(e);
}

function stalk(e: Enemy, dt: number): void {
  turnToHero(e, dt * GATOR.turnPace);
  const gap = Math.abs(hero.x - e.x);
  const moving = foeSees(e) && gap > 30 && e.halt <= 0;
  e.vx = approach(e.vx, moving ? e.face * GATOR.walk : 0, 60 * dt);
  if (e.cd <= 0 && hero.state !== "dead" && foeSees(e)) choose(e);
}

function rest(e: Enemy): void {
  Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.9) * waveScale(game.wave).cooldown });
}

function release(e: Enemy, time: number, next: Enemy["state"], act: (e: Enemy) => void): void {
  if (e.st < time) return;
  Object.assign(e, { state: next, st: 0 });
  act(e);
}

function rush(e: Enemy, dt: number): void {
  const before = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 24);
  rushHits(e);
  crackle(e, 0.5);
  if (!rushDone(e, before)) return;
  Object.assign(e, { state: "recover", st: 0 });
  dust(e.x + e.face * 16, GROUND, 6, e.face);
}

export function updateStormgator(e: Enemy, dt: number, ts: number): void {
  const s = e.state;
  if (s === "walk") stalk(e, dt);
  else if (s === "charge") release(e, rushWindup(), "lunge", launchRush);
  else if (s === "lunge") rush(e, dt);
  else if (s === "wind") release(e, slamWindup(), "swipe", slam);
  else if (s === "swipe" && e.st >= GATOR_TIMES.slam) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "summon") release(e, bellowWindup(), "shoot", bellow);
  else if (s === "shoot" && e.st >= GATOR_TIMES.bellow) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "recover" && e.st >= GATOR_TIMES.rest) rest(e);
  e.y = GROUND;
  if (e.state === "lunge") return;
  if (e.state === "recover") e.vx = approach(e.vx, 0, GATOR.skid * dt);
  else if (e.state !== "walk") e.vx = approach(e.vx, 0, 300 * dt);
  e.x = clampStageX(e.x + e.vx * dt, 24);
  const charging = e.state === "charge" || e.state === "wind" || e.state === "summon";
  crackle(e, (charging ? 0.4 : 0.04) * ts);
  if (e.state === "walk") touch(e);
}
