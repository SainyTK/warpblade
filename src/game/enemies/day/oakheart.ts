import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createSlash } from "../../effects/slash";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake, surfaceBelow } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { createAcorn } from "./acorn";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";
import { createRootSpike, type RootStrike } from "./rootSpike";

/** Oakheart blows before wave scaling */
export const OAK_HITS = { sweep: 22, root: 20, acorn: 12 } as const;
/** wind-ups before wave scaling, and how long each blow holds */
export const OAK_TIMES = { sweep: 0.6, root: 0.65, volley: 0.7, swing: 0.3, plant: 0.55, throw: 0.35 } as const;
const REACH = 40;
const ROOT_STEP = 17;

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
      e.x + e.face * rng.range(10, 30),
      e.y - rng.range(14, 34),
      e.face * rng.range(40, 100),
      -rng.range(10, 60),
      rng.range(0.5, 0.9),
      {
        col: rng.pick(DC.leaf),
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
    if (x < 6 || x > W - 6) break;
    game.fx.push(createRootSpike(x, mark + i * 0.07, OAK_HITS.root * e.power, strike, dir * 0.5));
    i++;
  }
  dust(e.x - 10, GROUND, 4, -1);
  dust(e.x + 10, GROUND, 4, 1);
  shake(0.2, 2);
  sfx.boom();
}

/** three acorns from the crown: one at Kael, one to either side, landing on whatever floor he stands over */
function lobAcorns(e: Enemy, enraged: boolean): void {
  const n = enraged ? 4 : 3;
  for (let i = 0; i < n; i++) {
    const tx = clamp(hero.x + (i - (n - 1) / 2) * 20, 8, W - 8);
    const ty = surfaceBelow(tx, hero.y - 2);
    game.fx.push(createAcorn(e.x + e.face * 4, e.y - 36, tx, ty, 0.85 + i * 0.08, OAK_HITS.acorn * e.power));
  }
  sfx.swing(0.6);
}

/** Oakheart, the old oak of the ruins: it sweeps a branch when Kael is close, sends roots along the floor when he keeps away, and lobs acorns when he climbs or when it is hurt */
export function updateOakheart(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const enraged = e.hp < e.max * 0.5;
  const w = waveScale(game.wave).windup;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 14 ? e.face * (enraged ? 26 : 18) : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      const high = hero.y < GROUND - 20;
      if (Math.abs(dx) < REACH && !high) Object.assign(e, { state: "wind", st: 0 });
      else if (high || (enraged && rng.chance(0.4))) Object.assign(e, { state: "volley", st: 0 });
      else if (Math.abs(dx) < 200) Object.assign(e, { state: "charge", st: 0, ax: hero.x });
    }
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
    if (rng.chance(0.3 * ts)) dust(e.x + rng.range(-12, 12), GROUND, 1);
    if (e.st >= OAK_TIMES.root * w) {
      Object.assign(e, { state: "burrow", st: 0 });
      plantRoots(e, enraged);
    }
  } else if (e.state === "burrow") {
    if (e.st >= OAK_TIMES.plant) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (rng.chance(0.4 * ts))
      particles.spawn(
        PK.SHARD,
        e.x + rng.range(-12, 12),
        e.y - rng.range(30, 40),
        rng.range(-20, 20),
        -rng.range(10, 40),
        rng.range(0.4, 0.8),
        {
          col: rng.pick(DC.leaf),
          size: 1,
        },
      );
    if (e.st >= OAK_TIMES.volley * w) {
      Object.assign(e, { state: "shoot", st: 0 });
      lobAcorns(e, enraged);
    }
  } else if (e.state === "shoot") {
    if (e.st >= OAK_TIMES.throw) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.75)
    Object.assign(e, {
      state: "walk",
      st: 0,
      cd: rng.range(1, 1.8) * (enraged ? 0.65 : 1) * waveScale(game.wave).cooldown,
    });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 14, W - 14);
  e.y = GROUND;
  if (rng.chance(0.15 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-8, 8), e.y - rng.range(12, 30), 0, -10, rng.range(0.5, 1), {
      sparks: DAY_SPARKS.rift,
    });
  if (rng.chance(0.03 * ts))
    particles.spawn(
      PK.SHARD,
      e.x + rng.range(-12, 12),
      e.y - rng.range(32, 40),
      rng.range(-10, 10),
      rng.range(0, 10),
      rng.range(0.8, 1.4),
      {
        col: DC.leaf[rng.int(1, 3)],
        size: 1,
      },
    );
}
