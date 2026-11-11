import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { ABYSS_HITS, VOID, VOID_SPARKS } from "./colors";
import { createVoidPillar } from "./voidPillar";
import { createVoidSpikes } from "./voidSpikes";

/** the cleave: how far ahead of its feet the blade reaches and how high, and how near the hero must be to draw it */
export const CLEAVE = { reach: 58, height: 52, range: 46, strike: 0.08, swing: 0.34, step: 90 } as const;
/** the wind-ups, as shares of the wave's wind-up scale; the second cleave of an enraged pair comes quicker */
export const SOVEREIGN_WINDUP = { cleave: 0.7, again: 0.38, call: 0.85, rend: 0.9 } as const;
/** the rift step: seconds to sink away, seconds to rise behind the hero, and how far behind */
export const RIFT_STEP = { sink: 0.35, rise: 0.35, behind: 34 } as const;
/** the pillars it calls down: how many, how far apart and how long between them */
const CALL = { count: 3, enraged: 5, gap: 34, beat: 0.14 } as const;
/** the row of spikes its planted blade sends each way, enraged only */
const REND_SPIKES = 8;
/** e.n through a recovery: what it just did, so the sprite holds the right pose */
export const SOVEREIGN_DID = { cleave: 1, call: 2, rend: 3 } as const;
/** e.ax while it winds up or swings a cleave: 1 when this is the second of an enraged pair */
export const AGAIN = 1;

const enragedNow = (e: Enemy): boolean => e.phase === 2;

/** the blade comes round: everything in front of it, floor to crown, is cut once */
function cleave(e: Enemy): void {
  const reach =
    e.face > 0
      ? ([e.x, e.y - CLEAVE.height, e.x + CLEAVE.reach, e.y] as const)
      : ([e.x - CLEAVE.reach, e.y - CLEAVE.height, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(reach, heroBox())) hurtHero(ABYSS_HITS.sovereignCleave * e.power, e.x);
  });
  game.fx.push(createImpact(e.x + e.face * 34, e.y - 18, e.face, true, VOID_SPARKS));
  dust(e.x + e.face * 30, GROUND, 5, e.face);
  shake(0.16, 2.5);
  sfx.swing(0.25);
}

/** it sinks into a rift in the floor and rises behind the hero, facing them */
function riftStep(e: Enemy): void {
  game.fx.push(createFloorRing(e.x, GROUND, 26, VOID, 0.4));
  const side = hero.face || 1;
  e.x = clamp(hero.x - side * RIFT_STEP.behind, 24, W - 24);
  e.face = Math.sign(hero.x - e.x) || side;
  game.fx.push(createFloorRing(e.x, GROUND, 26, VOID, 0.4));
  sfx.warp();
}

/** pillars of void light come down in a row centered on the hero, one after another */
function callPillars(e: Enemy): void {
  const n = enragedNow(e) ? CALL.enraged : CALL.count;
  for (let i = 0; i < n; i++) {
    const x = clamp(hero.x + (i - (n - 1) / 2) * CALL.gap + rng.range(-5, 5), 10, W - 10);
    game.fx.push(createVoidPillar(x, i * CALL.beat, ABYSS_HITS.sovereignPillar * e.power));
  }
  sfx.cast();
}

/** the blade is driven into the floor: a row of spikes runs out each way */
function rend(e: Enemy): void {
  game.fx.push(createFloorRing(e.x, GROUND, 36, VOID, 0.5));
  for (const dir of [-1, 1])
    game.fx.push(createVoidSpikes(e.x + dir * 22, dir, REND_SPIKES, ABYSS_HITS.sovereignSpikes * e.power));
  shake(0.35, 4);
  sfx.boom();
}

/** what it does next from a walk: a cleave up close, else a rift step, a call of pillars or, enraged, a rend */
function chooseAction(e: Enemy, dx: number): void {
  if (Math.abs(dx) < CLEAVE.range && facesHero(e)) {
    Object.assign(e, { state: "wind", st: 0, ax: 0 });
    return;
  }
  const roll = rng.next();
  const state = roll < 0.4 ? "blink" : roll < 0.75 || !enragedNow(e) ? "summon" : "volley";
  Object.assign(e, { state, st: 0, ax: 0 });
}

/**
 * The Abyss Sovereign, boss of the last wave: a crowned giant with a blade of void light. It walks the hero down and
 * cleaves everything in front of it; from further off it sinks into a rift and rises behind the hero to cleave, or
 * raises its blade and calls pillars of void light down in a row. Below half its HP it is enraged: it cleaves twice,
 * calls more pillars, and drives its blade into the floor to send spikes out both ways.
 */
export function updateSovereign(e: Enemy, dt: number, ts: number): void {
  if (e.phase === 1 && e.hp < e.max * 0.5) {
    e.phase = 2;
    shake(0.4, 3);
    sfx.boom();
  }
  const enraged = enragedNow(e);
  const dx = hero.x - e.x;
  const ws = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 30 ? e.face * (enraged ? 38 : 26) : 0, 160 * dt);
    if (e.cd <= 0 && hero.state !== "dead") chooseAction(e, dx);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    const windup = e.ax === AGAIN ? SOVEREIGN_WINDUP.again : SOVEREIGN_WINDUP.cleave;
    if (e.st >= windup * ws.windup) {
      Object.assign(e, { state: "swipe", st: 0, vx: e.face * CLEAVE.step });
      sfx.lunge();
    }
  } else if (e.state === "swipe") {
    if (e.st >= CLEAVE.strike && e.st - dt < CLEAVE.strike) cleave(e);
    if (e.st >= CLEAVE.swing) {
      // enraged, the blade comes back for a second cut, turned to the hero
      if (enraged && e.ax !== AGAIN)
        Object.assign(e, { state: "wind", st: 0, ax: AGAIN, face: Math.sign(dx) || e.face });
      else Object.assign(e, { state: "recover", st: 0, n: SOVEREIGN_DID.cleave });
    }
  } else if (e.state === "blink") {
    e.vx = 0;
    if (e.st >= RIFT_STEP.sink && e.st - dt < RIFT_STEP.sink) riftStep(e);
    if (e.st >= RIFT_STEP.sink + RIFT_STEP.rise) Object.assign(e, { state: "wind", st: 0, ax: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= SOVEREIGN_WINDUP.call * ws.windup) {
      callPillars(e);
      Object.assign(e, { state: "recover", st: 0, n: SOVEREIGN_DID.call });
    }
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= SOVEREIGN_WINDUP.rend * ws.windup) {
      rend(e);
      Object.assign(e, { state: "recover", st: 0, n: SOVEREIGN_DID.rend });
    }
  } else if (e.st >= 0.75)
    Object.assign(e, {
      state: "walk",
      st: 0,
      n: 0,
      ax: 0,
      cd: rng.range(0.9, 1.6) * (enraged ? 0.6 : 1) * ws.cooldown,
    });
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clamp(e.x + e.vx * dt, 20, W - 20);
  e.y = GROUND;
  if (rng.chance((enraged ? 0.14 : 0.07) * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-12, 12), e.y - rng.range(10, 52), 0, -14, rng.range(0.5, 1), {
      sparks: VOID_SPARKS,
    });
}
