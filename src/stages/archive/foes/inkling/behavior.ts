import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE_SPARKS } from "../colors";
import { createInkSplash } from "./splash";

export const INKLING_HITS = { splash: 13, touch: 6 } as const;
export const INKLING_HOP = { wind: 0.55, flight: 0.56, gravity: 540, reach: 84, recover: 0.8, splash: 15 } as const;
const CREEP = { speed: 24, beat: 2.6 } as const;
const NOTICE = { far: 96, near: 14 } as const;

function leap(e: Enemy): void {
  const dx = clamp(hero.x - e.x, -INKLING_HOP.reach, INKLING_HOP.reach);
  const flight = INKLING_HOP.flight;
  Object.assign(e, {
    state: "leap",
    st: 0,
    vx: dx / flight,
    vy: (-INKLING_HOP.gravity * flight) / 2,
    n: 0,
  });
  sfx.swing(1.4);
}

function land(e: Enemy): void {
  e.y = GROUND;
  Object.assign(e, { state: "recover", st: 0, vx: 0, vy: 0 });
  const reach = INKLING_HOP.splash;
  eachStanding(() => {
    if (boxHit([e.x - reach, GROUND - 10, e.x + reach, GROUND], heroBox()))
      hurtHero(INKLING_HITS.splash * e.power, e.x);
  });
  game.fx.push(createInkSplash(e.x));
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SPARK,
      e.x + fxRng.range(-5, 5),
      GROUND - 2,
      fxRng.range(-90, 90),
      -fxRng.range(50, 140),
      fxRng.range(0.3, 0.55),
      { sparks: FOE_SPARKS.ink, size: fxRng.range(1, 1.6) },
    );
  shake(0.1, 1.2);
  sfx.hit(false, 0.6);
}

export function updateInkling(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    turnToHero(e, dt);
    const beat = Math.max(0, Math.sin((game.t + e.seed) * CREEP.beat * Math.PI));
    const go = (Math.abs(dx) > NOTICE.near || !foeSees(e)) && e.halt <= 0;
    e.vx = approach(e.vx, go ? e.face * CREEP.speed * (0.4 + beat * 1.2) : 0, 240 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < NOTICE.far && Math.abs(dx) > NOTICE.near && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), GROUND - fxRng.range(0, 4), 0, -fxRng.range(14, 26), 0.4, {
        col: FOE_SPARKS.ink[1],
        size: 0.6,
      });
    if (e.pinned > 0) e.st = Math.min(e.st, INKLING_HOP.wind * 0.9);
    if (e.st >= INKLING_HOP.wind * waveScale(game.wave).windup) leap(e);
  } else if (e.state === "leap") {
    e.vy += INKLING_HOP.gravity * dt;
    e.y += e.vy * dt;
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.MOTE, e.x - e.face * 4, e.y - 6, 0, 18, 0.35, { col: FOE_SPARKS.ink[2], size: 0.8 });
    if (e.y >= GROUND && e.vy > 0) land(e);
  } else if (e.st >= INKLING_HOP.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.9) * waveScale(game.wave).cooldown });
  if (e.state !== "leap") {
    e.y = GROUND;
    if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(INKLING_HITS.touch * e.power, e.x);
  });
}
