import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { approach } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { clampStageX } from "../../adventure";
import { eachStanding, heroSlot } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { hurtHero } from "../../hurtHero";
import { game, hero, lights, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { MUD_SPARKS, RAIN_FOES, STORM_SPARKS, STORM_VOLT, WATER_SPARKS } from "./colors";
import { createHulkLight } from "./hulkLight";
import {
  cracked,
  HULK_COOLDOWN,
  HULK_ENRAGED,
  HULK_GLOBS,
  HULK_HITS,
  HULK_REACH,
  HULK_TIMES,
  HULK_WALK,
  HULK_WINDUP,
  RISE,
  RUSH,
  SINKING,
  STUCK_AFTER_RUSH,
} from "./hulkMoves";
import { createMudGlob } from "./mudGlob";
import { createMudWave } from "./mudWave";
import { createRushMark } from "./rushMark";
import { beginRush, type RushPath } from "./rushPath";
import { createRushStreak } from "./rushStreak";

const lit = new WeakSet<Enemy>();
const paths = new WeakMap<Enemy, RushPath>();
const struck = new WeakMap<RushPath, Set<number>>();

const enraged = (e: Enemy): boolean => e.phase === 2;

function slam(e: Enemy): void {
  const x = e.x + e.face * 24;
  game.fx.push(createFloorRing(x, GROUND, 30, PAL.shadow, 0.45));
  dust(x - 6, GROUND, 6, -1);
  dust(x + 6, GROUND, 6, 1);
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, x + rng.range(-12, 12), GROUND - 2, rng.range(-120, 120), -rng.range(80, 200), 0.5, {
      sparks: MUD_SPARKS,
    });
  shake(0.3, 3);
  sfx.boom();
  const { slam: reach, slamHeight: tall } = HULK_REACH;
  const box =
    e.face > 0 ? ([e.x, e.y - tall, e.x + reach, e.y] as const) : ([e.x - reach, e.y - tall, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(HULK_HITS.slam * e.power, e.x);
  });
}

function lob(e: Enemy): void {
  const spread = enraged(e) ? HULK_GLOBS.enraged : HULK_GLOBS.calm;
  spread.forEach((off, i) => {
    const tx = clampStageX(hero.x + off, 12);
    game.fx.push(createMudGlob(e.x - e.face * 4, e.y - 44, tx, 0.85 + i * 0.08, HULK_HITS.glob * e.power, null));
  });
  sfx.swing(0.5);
}

function rollWaves(e: Enemy): void {
  const x = e.x + e.face * 18;
  game.fx.push(createMudWave(x, e.face, HULK_HITS.wave * e.power));
  if (enraged(e)) game.fx.push(createMudWave(x, e.face, HULK_HITS.wave * e.power, HULK_ENRAGED.secondWave));
  dust(x, GROUND, 6, e.face);
  shake(0.15, 1.5);
  sfx.swing(0.4);
}

function sink(e: Enemy): void {
  Object.assign(e, { phase: 2, state: "burrow", st: 0, vx: 0, n: 0 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI;
    particles.spawn(PK.SPARK, e.x + Math.cos(a) * 12, GROUND - 2, Math.cos(a) * 110, -60 - Math.sin(a) * 120, 0.55, {
      sparks: MUD_SPARKS,
    });
  }
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SPARK, e.x + rng.range(-14, 14), GROUND - 3, rng.range(-70, 70), -rng.range(110, 190), 0.5, {
      sparks: WATER_SPARKS,
    });
  dust(e.x - 10, GROUND, 6, -1);
  dust(e.x + 10, GROUND, 6, 1);
  shake(0.15, 2);
}

function bubble(e: Enemy, dt: number): void {
  const every = SINKING.bubbleEvery;
  if (Math.floor(e.st / every) === Math.floor((e.st - dt) / every)) return;
  particles.spawn(PK.SPARK, e.x + rng.range(-14, 14), GROUND - 1, 0, -rng.range(20, 40), rng.range(0.4, 0.7), {
    sparks: WATER_SPARKS,
  });
}

function rise(e: Enemy): void {
  const chestY = e.y - 20;
  game.fx.push(createFloorRing(e.x, GROUND, RISE.ring, MUD_SPARKS, 0.5));
  game.fx.push(createFloorRing(e.x, GROUND, RISE.voltRing, STORM_VOLT, 0.5));
  lights.add(e.x, chestY, RISE.light, RAIN_FOES.wart, 0.9, 0.5);
  lights.add(e.x, chestY, RISE.flash, WHITE, 0.9, 0.15);
  for (let i = 0; i < RISE.chunks; i++)
    particles.spawn(
      PK.SHARD,
      e.x + rng.range(-12, 12),
      e.y - rng.range(6, 26),
      rng.range(-130, 130),
      -rng.range(90, 220),
      rng.range(0.5, 0.9),
      {
        col: rng.pick(MUD_SPARKS),
        size: rng.range(2, 3),
      },
    );
  for (let i = 0; i < RISE.embers; i++)
    particles.spawn(
      PK.EMBER,
      e.x + rng.range(-8, 8),
      chestY,
      rng.range(-80, 80),
      -rng.range(40, 140),
      rng.range(0.5, 0.9),
      {
        sparks: STORM_SPARKS,
      },
    );
  shake(0.4, 3);
  sfx.boom();
}

function rushReady(e: Enemy, dx: number): boolean {
  const far = Math.abs(dx);
  return enraged(e) && e.ay <= 0 && hero.ground && far >= RUSH.near && far <= RUSH.far && rng.chance(RUSH.chance);
}

function windRush(e: Enemy): void {
  const windup = HULK_WINDUP.rush * waveScale(game.wave).windup;
  const stop = clampStageX(e.x + e.face * RUSH.length, 16);
  const path: RushPath = {
    owner: e,
    from: e.x + e.face * RUSH.slideHalfWidth,
    to: stop + e.face * RUSH.slideHalfWidth,
    dir: e.face,
    windup,
  };
  paths.set(e, path);
  beginRush(path);
  Object.assign(e, { state: "dive", st: 0, ax: stop });
  game.fx.push(createRushMark(path));
}

function launchRush(e: Enemy): void {
  const path = paths.get(e);
  Object.assign(e, { state: "lunge", st: 0, vx: 0 });
  if (path) {
    struck.set(path, new Set());
    game.fx.push(createRushStreak(path));
  }
  shake(0.12, 1.5);
  sfx.swing(0.5);
}

function slide(e: Enemy, dt: number): void {
  const step = e.face * RUSH.speed * dt;
  const left = e.ax - e.x;
  const done = Math.abs(left) <= Math.abs(step) || e.st >= RUSH.most || Math.sign(left) !== e.face;
  e.x = done ? e.ax : e.x + step;
  const hit = struck.get(paths.get(e) as RushPath);
  const box = [e.x - RUSH.slideHalfWidth, e.y - RUSH.slideHeight, e.x + RUSH.slideHalfWidth, e.y] as const;
  eachStanding(() => {
    if (!hit || hit.has(heroSlot()) || !boxHit(box, heroBox())) return;
    hit.add(heroSlot());
    hurtHero(HULK_HITS.rush * e.power, e.x);
  });
  for (let i = 0; i < 2; i++)
    particles.spawn(
      PK.SPARK,
      e.x + e.face * (RUSH.slideHalfWidth + 2),
      GROUND - 2,
      e.face * rng.range(60, 160),
      -rng.range(40, 120),
      0.4,
      {
        sparks: MUD_SPARKS,
      },
    );
  if (rng.chance(0.6))
    particles.spawn(PK.SPARK, e.x + rng.range(-10, 10), GROUND - 1, rng.range(-40, 40), -rng.range(50, 110), 0.4, {
      sparks: WATER_SPARKS,
    });
  if (done) {
    Object.assign(e, { state: "recover", st: 0, vx: 0, n: STUCK_AFTER_RUSH });
    e.ay = RUSH.every;
    for (let i = 0; i < 6; i++)
      particles.spawn(
        PK.SPARK,
        e.x + e.face * RUSH.slideHalfWidth,
        GROUND - 2,
        rng.range(-60, 90) * e.face,
        -rng.range(60, 140),
        0.45,
        {
          sparks: MUD_SPARKS,
        },
      );
    dust(e.x + e.face * RUSH.slideHalfWidth, GROUND, 6, e.face);
    shake(0.2, 2);
  }
}

function choose(e: Enemy, dx: number): void {
  if (rushReady(e, dx)) windRush(e);
  else if (Math.abs(dx) < HULK_REACH.near) Object.assign(e, { state: "wind", st: 0 });
  else if (Math.abs(dx) < HULK_REACH.wave && hero.ground && rng.chance(HULK_REACH.waveChance))
    Object.assign(e, { state: "charge", st: 0 });
  else Object.assign(e, { state: "volley", st: 0 });
}

function rest(e: Enemy): void {
  const share = enraged(e) ? HULK_COOLDOWN.enraged : 1;
  const cd = rng.range(HULK_COOLDOWN.least, HULK_COOLDOWN.most) * share * waveScale(game.wave).cooldown;
  Object.assign(e, { state: "walk", st: 0, n: 0, cd });
}

function idleParticles(e: Enemy, ts: number): void {
  if (e.state === "burrow") return;
  if (rng.chance(0.12 * ts))
    particles.spawn(PK.SPARK, e.x + rng.range(-12, 12), e.y - rng.range(10, 30), 0, 20, rng.range(0.3, 0.6), {
      sparks: MUD_SPARKS,
    });
  if (cracked(e) && rng.chance(0.3 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + rng.range(-12, 6),
      e.y - rng.range(10, 30),
      rng.range(-10, 10),
      -rng.range(15, 40),
      rng.range(0.4, 0.8),
      {
        sparks: STORM_SPARKS,
      },
    );
}

export function updateBoghulk(e: Enemy, dt: number, ts: number): void {
  if (!lit.has(e)) {
    lit.add(e);
    game.fx.push(createHulkLight(e));
  }
  e.ay -= dt;
  if (e.phase === 1 && e.hp <= e.max * SINKING.at) sink(e);
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  const fast = enraged(e) ? HULK_ENRAGED.windup : 1;
  if (e.state === "walk") {
    turnToHero(e, dt);
    const speed = enraged(e) ? HULK_WALK.enraged : HULK_WALK.speed;
    e.vx = approach(e.vx, Math.abs(dx) > HULK_WALK.stop ? e.face * speed : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") choose(e, dx);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.slam * fast * scale.windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      slam(e);
    }
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.wave * fast * scale.windup) {
      rollWaves(e);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.globs * fast * scale.windup) {
      lob(e);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "dive") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.rush * scale.windup) launchRush(e);
  } else if (e.state === "lunge") {
    slide(e, dt);
  } else if (e.state === "burrow") {
    Object.assign(e, { vx: 0, pinned: 0, halt: 0 });
    bubble(e, dt);
    if (e.st >= HULK_TIMES.sink) {
      Object.assign(e, { state: "hop", st: 0 });
      rise(e);
    }
  } else if (e.state === "hop") {
    Object.assign(e, { vx: 0, pinned: 0, halt: 0 });
    if (e.st >= HULK_TIMES.rise) {
      Object.assign(e, { state: "walk", st: 0, n: 0, cd: HULK_TIMES.afterRise * scale.cooldown });
      e.ay = RUSH.first;
    }
  } else if (e.state === "swipe" || e.state === "shoot") {
    if (e.st >= HULK_TIMES.strike) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else if (e.st >= (e.n === STUCK_AFTER_RUSH ? HULK_TIMES.stuck : HULK_TIMES.recover)) rest(e);
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 4 * dt;
  if (e.state !== "lunge") e.x = clampStageX(e.x + e.vx * dt, 16);
  e.y = GROUND;
  idleParticles(e, ts);
}
