import { GROUND } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { clampStageX, stageLeft, stageRight } from "../../adventure";
import { eachStanding } from "../../coopHooks";
import { createSlash } from "../../effects/slash";
import { hurtHero } from "../../hurtHero";
import { fxRng, game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake, surfaceBelow } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { createAcorn } from "./acorn";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";
import { createRootSpike, type RootStrike } from "./rootSpike";

/** Oakheart blows before wave scaling */
export const OAK_HITS = { sweep: 14, root: 16, acorn: 12 } as const;
const OAK_MOVE = { usual: 0, thicket: 1, canopy: 2 } as const;
const THICKET = { span: 120, enraged: 160, windup: 0.85 } as const;
const CANOPY = { step: 22, gap: 2, windup: 1, flight: 1.05, beat: 0.035 } as const;
/** wind-ups before wave scaling, and how long each blow holds */
export const OAK_TIMES = { sweep: 0.6, root: 0.65, volley: 0.7, swing: 0.3, plant: 0.55, throw: 0.35 } as const;
/** how much longer Oakheart rests between attacks before it is enraged */
const OAK_CALM_REST = 1.5;
/** enraged it rests 0.8 of the base */
const OAK_ENRAGED_REST = 0.8;
/** below this share of its HP Oakheart is enraged: it attacks faster and drops its guard */
export const OAK_ENRAGE = 0.5;
const REACH = 40;
const ROOT_STEP = 17;
/** the bright end of the leaf ramp, so the burst reads against the crown and the sky */
const BURST_LEAVES = DC.leaf.slice(2);
/** the Oakheart whose bark has already split, so the burst shows once */
const split = new WeakSet<Enemy>();
const SPLIT_BURST = { leaves: 16, chips: 8, sparks: 6 } as const;

/** the moment it first falls under half HP: leaves burst from the crown and the ground shakes */
function splitBark(e: Enemy): void {
  split.add(e);
  for (let i = 0; i < SPLIT_BURST.leaves; i++)
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-12, 12),
      e.y - fxRng.range(36, 42),
      fxRng.range(-110, 110),
      -fxRng.range(80, 150),
      fxRng.range(0.7, 1.2),
      {
        col: fxRng.pick(BURST_LEAVES),
        size: 3,
      },
    );
  for (let i = 0; i < SPLIT_BURST.chips; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * fxRng.range(-2, 0),
      e.y - fxRng.range(16, 28),
      fxRng.pick([-1, 1]) * fxRng.range(60, 140),
      -fxRng.range(40, 100),
      fxRng.range(0.5, 0.8),
      {
        col: fxRng.pick(DAY_SPARKS.bark),
        size: 2,
      },
    );
  for (let i = 0; i < SPLIT_BURST.sparks; i++)
    particles.spawn(
      PK.EMBER,
      e.x + e.face * fxRng.range(-2, 0),
      e.y - fxRng.range(16, 28),
      fxRng.range(-50, 50),
      -fxRng.range(20, 70),
      fxRng.range(0.5, 0.9),
      {
        sparks: DAY_SPARKS.rift,
      },
    );
  shake(0.3, 3);
  sfx.block();
}

function sweep(e: Enemy): void {
  game.fx.push(
    createSlash(e.x, e.y, e.face, {
      cx: 6,
      cy: -20,
      R: 26,
      sy: 0.6,
      rot: -0.15,
      a0: -2.4,
      a1: 1.2,
      W: 8,
      ramp: DC.leaf,
    }),
  );
  const reach = e.face > 0 ? ([e.x, e.y - 42, e.x + 44, e.y] as const) : ([e.x - 44, e.y - 42, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(reach, heroBox())) hurtHero(OAK_HITS.sweep * e.power, e.x);
  });
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * fxRng.range(10, 30),
      e.y - fxRng.range(14, 34),
      e.face * fxRng.range(40, 100),
      -fxRng.range(10, 60),
      fxRng.range(0.5, 0.9),
      {
        col: fxRng.pick(DC.leaf),
        size: 1.2,
      },
    );
  sfx.swing(0.35);
}

/** a line of roots that breaks the floor from its feet toward where Kael stood, a little past him; enraged it reaches farther */
function plantRoots(e: Enemy, enraged: boolean): void {
  const strike: RootStrike = { struck: new Set() };
  const dir = Math.sign(e.ax - e.x) || e.face;
  const span = Math.abs(e.ax - e.x) + (enraged ? 40 : 20);
  const mark = 0.4 * waveScale(game.wave).windup;
  let i = 0;
  for (let d = 22; d <= span; d += ROOT_STEP) {
    const x = e.x + dir * d;
    if (x < stageLeft() + 6 || x > stageRight() - 6) break;
    game.fx.push(createRootSpike(x, mark + i * 0.07, OAK_HITS.root * e.power, strike, dir * 0.5));
    i++;
  }
  dust(e.x - 10, GROUND, 4, -1);
  dust(e.x + 10, GROUND, 4, 1);
  shake(0.2, 2);
  sfx.boom();
}

function thicket(e: Enemy, enraged: boolean): void {
  const strike: RootStrike = { struck: new Set() };
  const span = enraged ? THICKET.enraged : THICKET.span;
  const mark = 0.4 * waveScale(game.wave).windup;
  for (const dir of [-1, 1]) {
    let i = 0;
    for (let d = 22; d <= span; d += ROOT_STEP) {
      const x = e.x + dir * d;
      if (x < stageLeft() + 6 || x > stageRight() - 6) break;
      game.fx.push(createRootSpike(x, mark + i * 0.07, OAK_HITS.root * e.power, strike, dir * 0.5));
      i++;
    }
  }
  dust(e.x - 10, GROUND, 6, -1);
  dust(e.x + 10, GROUND, 6, 1);
  shake(0.3, 3);
  sfx.boom();
}

function canopy(e: Enemy): void {
  const left = stageLeft() + 10;
  const right = stageRight() - 10;
  const slots = Math.floor((right - left) / CANOPY.step) + 1;
  const safe = rng.int(1, Math.max(1, slots - CANOPY.gap - 1));
  for (let i = 0; i < slots; i++) {
    if (i >= safe && i < safe + CANOPY.gap) continue;
    const tx = left + i * CANOPY.step;
    const ty = surfaceBelow(tx, GROUND - 2);
    const flight = CANOPY.flight + i * CANOPY.beat;
    game.fx.push(createAcorn(e.x + e.face * 4, e.y - 36, tx, ty, flight, OAK_HITS.acorn * e.power));
  }
  shake(0.25, 2);
  sfx.swing(0.5);
}

/** three acorns from the crown: one at Kael, one to either side, landing on whatever floor he stands over */
export function lobAcorns(e: Enemy, enraged: boolean): void {
  const n = enraged ? 4 : 3;
  for (let i = 0; i < n; i++) {
    const tx = clampStageX(hero.x + (i - (n - 1) / 2) * 20, 8);
    const ty = surfaceBelow(tx, hero.y - 2);
    game.fx.push(createAcorn(e.x + e.face * 4, e.y - 36, tx, ty, 0.85 + i * 0.08, OAK_HITS.acorn * e.power));
  }
  sfx.swing(0.6);
}

function choose(e: Enemy, dx: number, enraged: boolean): void {
  const high = hero.y < GROUND - 20;
  const roll = rng.next();
  if (Math.abs(dx) < REACH && !high) {
    if (roll < 0.3) Object.assign(e, { state: "charge", st: 0, n: OAK_MOVE.thicket });
    else Object.assign(e, { state: "wind", st: 0, n: OAK_MOVE.usual });
  } else if (enraged && (high ? roll < 0.5 : roll < 0.3))
    Object.assign(e, { state: "volley", st: 0, n: OAK_MOVE.canopy });
  else if (high || (enraged && roll < 0.6)) Object.assign(e, { state: "volley", st: 0, n: OAK_MOVE.usual });
  else if (roll < 0.25) Object.assign(e, { state: "charge", st: 0, n: OAK_MOVE.thicket });
  else if (Math.abs(dx) < 200) Object.assign(e, { state: "charge", st: 0, ax: hero.x, n: OAK_MOVE.usual });
  else Object.assign(e, { state: "volley", st: 0, n: OAK_MOVE.usual });
}

/** Oakheart, the old oak of the ruins: it sweeps a branch when Kael is close, sends roots along the floor when he keeps away, and lobs acorns when he climbs or when it is hurt */
export function updateOakheart(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.phase === 1 && e.hp < e.max * OAK_ENRAGE) e.phase = 2;
  const enraged = e.phase === 2;
  if (enraged && !split.has(e)) splitBark(e);
  const w = waveScale(game.wave).windup;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 14 ? e.face * (enraged ? 26 : 18) : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") choose(e, dx, enraged);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= OAK_TIMES.sweep * (enraged ? 0.8 : 1) * w) {
      Object.assign(e, { state: "swipe", st: 0 });
      sweep(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= OAK_TIMES.swing) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    // arms raised, then driven into the floor
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.3 * ts)) dust(e.x + fxRng.range(-12, 12), GROUND, 1);
    const thick = e.n === OAK_MOVE.thicket;
    if (e.st >= (thick ? THICKET.windup : OAK_TIMES.root) * w) {
      Object.assign(e, { state: "burrow", st: 0 });
      if (thick) thicket(e, enraged);
      else plantRoots(e, enraged);
    }
  } else if (e.state === "burrow") {
    if (e.st >= OAK_TIMES.plant) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(
        PK.SHARD,
        e.x + fxRng.range(-12, 12),
        e.y - fxRng.range(30, 40),
        fxRng.range(-20, 20),
        -fxRng.range(10, 40),
        fxRng.range(0.4, 0.8),
        {
          col: fxRng.pick(DC.leaf),
          size: 1,
        },
      );
    const rain = e.n === OAK_MOVE.canopy;
    if (e.st >= (rain ? CANOPY.windup : OAK_TIMES.volley) * w) {
      Object.assign(e, { state: "shoot", st: 0 });
      if (rain) canopy(e);
      else lobAcorns(e, enraged);
    }
  } else if (e.state === "shoot") {
    if (e.st >= OAK_TIMES.throw) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.75)
    Object.assign(e, {
      state: "walk",
      st: 0,
      n: OAK_MOVE.usual,
      cd: rng.range(1, 1.8) * (enraged ? OAK_ENRAGED_REST : OAK_CALM_REST) * waveScale(game.wave).cooldown,
    });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = GROUND;
  if (fxRng.chance(0.15 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-8, 8), e.y - fxRng.range(12, 30), 0, -10, fxRng.range(0.5, 1), {
      sparks: DAY_SPARKS.rift,
    });
  if (fxRng.chance(0.03 * ts))
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-12, 12),
      e.y - fxRng.range(32, 40),
      fxRng.range(-10, 10),
      fxRng.range(0, 10),
      fxRng.range(0.8, 1.4),
      {
        col: DC.leaf[fxRng.int(1, 3)],
        size: 1,
      },
    );
}
