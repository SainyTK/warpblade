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
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MITE } from "./colors";
import { MITE_HITS, MITE_MOVE, MITE_TIMES } from "./moves";

function scuttle(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const burst = 0.55 + 0.45 * Math.abs(Math.sin(game.t * 5 + e.seed));
  const moving = (Math.abs(dx) > 8 || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, moving ? e.face * MITE_MOVE.scuttle * burst : 0, 260 * dt);
  const near = Math.abs(dx) < MITE_MOVE.reach && Math.abs(hero.y - e.y) < MITE_MOVE.rise;
  if (e.cd <= 0 && facesHero(e) && near && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0 });
}

function hop(e: Enemy): void {
  const u = clamp(e.st / MITE_TIMES.hop);
  e.vx = e.face * MITE_MOVE.hop * (1 - u * 0.5);
  e.y = GROUND - Math.sin(Math.PI * u) * MITE_MOVE.height;
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(MITE_HITS.hop * e.power, e.x - e.face * 6);
    }
  });
  if (u < 1) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3 });
  e.y = GROUND;
  dust(e.x, GROUND, 2);
}

export function updateMoldmite(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") scuttle(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(6 * dt)) dust(e.x - e.face * 3, GROUND, 1, -e.face);
    if (e.st >= MITE_TIMES.crouch * windup) {
      Object.assign(e, { state: "lunge", st: 0, n: 0 });
      sfx.swing(1.9);
    }
  } else if (e.state === "lunge") hop(e);
  else if (e.st >= MITE_TIMES.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.8) * waveScale(game.wave).cooldown });
  if (e.state === "recover") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "lunge") e.y = GROUND;
  if (fxRng.chance(0.04 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-3, 3), e.y - 8, 0, -7, 0.6, { col: MITE.fuzz[2], size: 0.5 });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(MITE_HITS.touch * e.power, e.x);
  });
}
