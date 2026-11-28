import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { shardBurst } from "../burst";
import { VEIL } from "../colors";
import { DAZED, RAM, RAM_HITS } from "./constants";

function stop(e: Enemy, wall: boolean): void {
  Object.assign(e, { state: "recover", st: 0, n: wall ? DAZED : 0, vx: wall ? -e.face * 50 : e.vx * 0.5 });
  if (!wall) return;
  sfx.block();
  shardBurst(e.x + e.face * 14, GROUND - 14, 8, VEIL.crystal);
}

function charge(e: Enemy): void {
  e.vx = e.face * RAM.speed;
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(RAM_HITS.charge * e.power, e.x - e.face * 10);
  });
  if (fxRng.chance(0.5)) dust(e.x - e.face * 10, GROUND, 1, -e.face);
  const stalled = e.st > 0.05 && Math.abs(e.x - e.ay) < 0.3;
  const edge = (e.face < 0 && e.x <= stageLeft() + 14) || (e.face > 0 && e.x >= stageRight() - 14);
  if (stalled || edge) stop(e, true);
  else if (Math.abs(e.x - e.ax) >= RAM.run) stop(e, false);
}

export function updateShardram(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const go = e.halt <= 0 && (!foeSees(e) || Math.abs(dx) > 26);
    e.vx = approach(e.vx, go ? e.face * RAM.pace : 0, 140 * dt);
    const near = Math.abs(dx) < RAM.notice && Math.abs(hero.y - e.y) < 40;
    if (e.cd <= 0 && near && facesHero(e) && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 10, 200 * dt);
    if (fxRng.chance(dt * 9)) dust(e.x + e.face * 6, GROUND, 1, -e.face);
    if (e.st >= RAM.wind * scale.windup && e.pinned <= 0) {
      Object.assign(e, { state: "charge", st: 0, n: 0, ax: e.x });
      sfx.lunge();
      dust(e.x, GROUND, 5, -e.face);
    }
  } else if (e.state === "charge") charge(e);
  else {
    e.vx = approach(e.vx, 0, 260 * dt);
    const rest = e.n === DAZED ? RAM.dazed : RAM.recover;
    if (e.st >= rest) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.3, 2.1) * scale.cooldown });
  }
  e.ay = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(RAM_HITS.touch * e.power, e.x);
  });
}
