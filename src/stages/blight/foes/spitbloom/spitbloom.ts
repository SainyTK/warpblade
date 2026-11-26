import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { createSporeShot, strikeOnce } from "../../spores";

export const BLOOM_HITS = { glob: 12, bite: 15 } as const;
export const BLOOM_TIMES = { swell: 0.75, spit: 0.3, gape: 0.5, bite: 0.2, rest: 0.7 } as const;
const BITE = { reach: 30, height: 24, trigger: 30 } as const;
const SPIT_RANGE = 175;
const MOUTH = { x: 9, y: -21 } as const;

export const headAhead = (e: Enemy): number => e.x + e.face * MOUTH.x;

function spit(e: Enemy): void {
  const tx = clamp(hero.x + hero.vx * 0.25, e.x - SPIT_RANGE, e.x + SPIT_RANGE);
  const ty = surfaceBelow(tx, hero.y - 2);
  const flight = clamp(0.55 + Math.abs(tx - e.x) / 320, 0.6, 1);
  const damage = BLOOM_HITS.glob * e.power;
  game.fx.push(
    createSporeShot({
      x: headAhead(e),
      y: e.y + MOUTH.y,
      tx,
      ty,
      flight,
      damage,
      size: 2.2,
      splash: 11,
      puddle: { half: 8, life: 1.6, damage: damage * 0.35 },
    }),
  );
  sfx.swing(0.5);
}

function bite(e: Enemy): void {
  const x0 = e.face > 0 ? e.x + 2 : e.x - BITE.reach;
  const x1 = e.face > 0 ? e.x + BITE.reach : e.x - 2;
  strikeOnce(new Set(), [x0, e.y - BITE.height, x1, e.y], BLOOM_HITS.bite * e.power, e.x);
  sfx.swing(0.3);
}

export function updateSpitbloom(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const windup = waveScale(game.wave).windup;
  e.vx = 0;
  if (e.state === "walk") {
    turnToHero(e, dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead" && foeSees(e)) {
      const low = hero.y > e.y - BITE.height;
      if (Math.abs(dx) < BITE.trigger && low) Object.assign(e, { state: "charge", st: 0 });
      else if (Math.abs(dx) < SPIT_RANGE) Object.assign(e, { state: "wind", st: 0 });
    }
  } else if (e.state === "wind") {
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, headAhead(e) + fxRng.range(-4, 4), e.y - 22, 0, -10, 0.4, {
        col: BLIGHT.poison[3],
        size: 0.5,
      });
    if (e.st >= BLOOM_TIMES.swell * windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      spit(e);
    }
  } else if (e.state === "shoot") {
    if (e.st >= BLOOM_TIMES.spit) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    if (e.st >= BLOOM_TIMES.gape * windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      bite(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= BLOOM_TIMES.bite) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= BLOOM_TIMES.rest) {
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown });
  }
}
