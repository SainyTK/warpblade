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
import { charge, startCharge } from "./charge";
import { BOAR } from "./colors";
import { BOAR_HITS, BOAR_MOVE, BOAR_TIMES } from "./moves";

function snort(e: Enemy): void {
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.MOTE, e.x + e.face * 17, e.y - 6, e.face * fxRng.range(10, 30), -fxRng.range(4, 16), 0.5, {
      col: fxRng.pick(BOAR.pustule.slice(1, 4)),
      size: 0.7,
    });
}

function paw(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 500 * dt);
  const scrape = Math.floor(e.st * 6) !== Math.floor((e.st - dt) * 6);
  if (scrape) dust(e.x + e.face * 9, GROUND, 2, -e.face);
  if (scrape && Math.floor(e.st * 6) % 2 === 0) snort(e);
  if (e.pinned > 0) e.st = Math.min(e.st, BOAR_TIMES.paw * waveScale(game.wave).windup * 0.9);
  if (e.st >= BOAR_TIMES.paw * waveScale(game.wave).windup) startCharge(e);
}

function walk(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  turnToHero(e, dt);
  const moving = (Math.abs(dx) > 26 || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, moving ? e.face * BOAR_MOVE.walk : 0, 160 * dt);
  const close = Math.abs(dx) < BOAR_MOVE.notice && Math.abs(hero.y - e.y) < 50;
  if (e.cd <= 0 && facesHero(e) && close && hero.state !== "dead") {
    Object.assign(e, { state: "wind", st: 0, n: 0 });
    sfx.swing(0.4);
  }
}

export function updateRotboar(e: Enemy, dt: number, ts: number): void {
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") paw(e, dt);
  else if (e.state === "lunge") charge(e, ts);
  else {
    if (Math.abs(e.vx) > 20 && fxRng.chance(14 * dt)) dust(e.x + e.face * 8, GROUND, 1, e.face);
    if (e.st >= BOAR_TIMES.recover)
      Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2.1) * waveScale(game.wave).cooldown });
  }
  if (e.state === "recover") e.vx -= e.vx * BOAR_MOVE.skid * dt;
  e.ay = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-8, 4), e.y - fxRng.range(16, 20), 0, -8, fxRng.range(0.5, 0.9), {
      col: BOAR.pustule[2],
      size: 0.5,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(BOAR_HITS.touch * e.power, e.x);
  });
}
