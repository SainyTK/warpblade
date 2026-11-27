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
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { BOOKMITE, BOOKMITE_HITS } from "./moves";

function scuttle(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const go = (gap > BOOKMITE.near || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, go ? e.face * BOOKMITE.speed : 0, 260 * dt);
  if (e.cd <= 0 && facesHero(e) && gap < BOOKMITE.reach && hero.state !== "dead")
    Object.assign(e, { state: "wind", st: 0, n: 0 });
}

function lunge(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, vx: e.face * BOOKMITE.hop, vy: -BOOKMITE.rise, n: 0 });
  sfx.swing(1.8);
}

function bite(e: Enemy): void {
  if (e.n > 0) return;
  eachStanding(() => {
    if (e.n > 0 || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(BOOKMITE_HITS.bite * e.power, e.x);
  });
}

function land(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, vy: 0 });
  e.y = GROUND;
  dust(e.x, GROUND, 2);
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.FLAKE, e.x, GROUND - 4, fxRng.range(-30, 30), -fxRng.range(20, 50), 0.6, {
      col: FOE.paper[3],
      size: 0.8,
    });
}

export function updateBookmite(e: Enemy, dt: number): void {
  if (e.state === "walk") scuttle(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 8, 300 * dt);
    if (e.pinned > 0) e.st = Math.min(e.st, BOOKMITE.wind * 0.9);
    if (e.st >= BOOKMITE.wind * waveScale(game.wave).windup) lunge(e);
  } else if (e.state === "lunge") {
    e.vy += BOOKMITE.gravity * dt;
    e.y += e.vy * dt;
    bite(e);
    if (e.y >= GROUND && e.vy > 0) land(e);
  } else if (e.st >= BOOKMITE.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.7) * waveScale(game.wave).cooldown });
  if (e.state !== "lunge") e.y = GROUND;
  if (e.state === "recover") e.vx -= e.vx * 8 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 8);
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(BOOKMITE_HITS.touch * e.power, e.x);
  });
}
