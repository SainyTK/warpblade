import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { createRift } from "../../effects/rift";
import { createSlash } from "../../effects/slash";
import { hurtHero } from "../../hurtHero";
import { game, hero, lights, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { makeEnemy } from "../enemy";
import { facesHero, turnToHero } from "../facing";
import { kindOf } from "../kinds";
import { INNER_FIRE } from "./colors";
import { createLanternLight, lanternPoint } from "./lanternLight";
import { moonLook } from "./moonLook";
import { createMoonMark } from "./moonMark";
import { createMoonShard } from "./moonShard";
import {
  AGAIN,
  FLOCK,
  KNEEL,
  MOONFALL,
  PROCESSION,
  REAP,
  SHEPHERD_COOLDOWN,
  SHEPHERD_DID,
  SHEPHERD_HITS,
  SHEPHERD_TIMES,
  SHEPHERD_WALK,
  TOLL,
  tollWindup,
} from "./shepherdMoves";

const RISE_PULSE = { radius: 90, strength: 0.9, life: 0.6, ring: 64 } as const;
const lit = new WeakSet<Enemy>();

const enraged = (e: Enemy): boolean => e.phase === 2;

function reap(e: Enemy): void {
  const look = moonLook(enraged(e));
  game.fx.push(
    createSlash(e.x, e.y, e.face, {
      cx: 22,
      cy: -6,
      R: 32,
      sy: 0.35,
      rot: 0,
      a0: 2.9,
      a1: 0.1,
      W: 7,
      ramp: look.ramp,
    }),
  );
  const reach: [number, number, number, number] =
    e.face > 0
      ? [e.x - REAP.behind, GROUND - REAP.height, e.x + REAP.reach, GROUND]
      : [e.x - REAP.reach, GROUND - REAP.height, e.x + REAP.behind, GROUND];
  eachStanding(() => {
    if (boxHit(reach, heroBox())) hurtHero(SHEPHERD_HITS.reap * e.power, e.x);
  });
  dust(e.x + e.face * 30, GROUND, 4, e.face);
  dust(e.x + e.face * 48, GROUND, 3, e.face);
  sfx.swing(0.3);
}

function layMarks(e: Enemy): void {
  const look = moonLook(enraged(e));
  const strike = { struck: new Set<number>() };
  const windup = tollWindup(e) * waveScale(game.wave).windup;
  const side = Math.sign(hero.x - e.x) || e.face;
  const { radius, shrink } = enraged(e) ? PROCESSION : TOLL;
  const offsets = enraged(e) ? [0, -PROCESSION.gap, PROCESSION.gap] : [0];
  offsets.forEach((offset, i) => {
    const x = clamp(hero.x + side * offset, 10, W - 10);
    const damage = SHEPHERD_HITS.toll * e.power;
    game.fx.push(createMoonMark({ owner: e, x, radius, shrink, windup, delay: i * TOLL.beat, damage, look, strike }));
  });
}

function toll(e: Enemy): void {
  const [x, y] = lanternPoint(e);
  lights.add(x, y, 40, moonLook(enraged(e)).ramp[3], 0.8, 0.25);
  shake(0.18, 2);
  sfx.boom();
}

function moonfall(e: Enemy): void {
  const look = moonLook(enraged(e));
  const strike = { struck: new Set<number>() };
  MOONFALL.offsets.forEach((offset, i) => {
    const x = clamp(hero.x + offset, 8, W - 8);
    game.fx.push(createMoonShard({ x, delay: i * MOONFALL.beat, damage: SHEPHERD_HITS.shard * e.power, look, strike }));
  });
  const [lx, ly] = lanternPoint(e);
  lights.add(lx, ly, 60, look.ramp[3], 0.9, 0.4);
  sfx.cast();
}

function callFlock(e: Enemy): void {
  const husks = game.enemies.filter((m) => m.type === "husk" && m.hp > 0).length;
  const rift = kindOf("husk").rift;
  for (let i = 0; i < Math.min(FLOCK.most, FLOCK.most - husks); i++) {
    const x = clamp(hero.x + (i ? FLOCK.side : -FLOCK.side), FLOCK.edge, W - FLOCK.edge);
    const y = rift.y();
    game.fx.push(
      createRift(x, rift.riftY(y), rift.height, i * 0.2, () =>
        game.enemies.push(makeEnemy("husk", x, y, game.wave, FLOCK.xpShare)),
      ),
    );
  }
  e.ay = FLOCK.every;
  sfx.cast();
}

function kneel(e: Enemy): void {
  Object.assign(e, { state: "burrow", st: 0, vx: 0, phase: 2, ax: 0 });
  dust(e.x - 6, GROUND, 4, -1);
  dust(e.x + 10, GROUND, 4, 1);
  shake(0.15, 2);
}

function rise(e: Enemy): void {
  const [x, y] = lanternPoint(e);
  lights.add(x, y, RISE_PULSE.radius, INNER_FIRE[3], RISE_PULSE.strength, RISE_PULSE.life);
  lights.add(x, y, 18, WHITE, 0.9, 0.15);
  game.fx.push(createFloorRing(e.x, GROUND, RISE_PULSE.ring, INNER_FIRE, 0.55));
  for (let i = 0; i < 16; i++)
    particles.spawn(PK.EMBER, x, y, rng.range(-90, 90), rng.range(-120, 20), rng.range(0.4, 0.9), {
      sparks: moonLook(true).sparks,
    });
  shake(0.4, 3);
  sfx.boom();
}

function flockReady(e: Enemy): boolean {
  if (e.ay > 0) return false;
  return game.enemies.filter((m) => m.type === "husk" && m.hp > 0).length < FLOCK.most;
}

function choose(e: Enemy, dx: number): void {
  const far = Math.abs(dx);
  const low = hero.y > GROUND - REAP.high;
  if (flockReady(e)) {
    Object.assign(e, { state: "summon", st: 0 });
    return;
  }
  if (far < REAP.range && low) {
    Object.assign(e, { state: "wind", st: 0, ax: 0 });
    return;
  }
  if (enraged(e) && far > MOONFALL.near && rng.chance(MOONFALL.chance)) {
    Object.assign(e, { state: "volley", st: 0 });
    return;
  }
  if (far <= TOLL.far) {
    Object.assign(e, { state: "charge", st: 0 });
    layMarks(e);
  }
}

function settle(e: Enemy, did: number): void {
  Object.assign(e, { state: "recover", st: 0, n: did, ax: 0 });
}

export function updateShepherd(e: Enemy, dt: number, ts: number): void {
  if (!lit.has(e)) {
    lit.add(e);
    e.ay = FLOCK.first;
    game.fx.push(createLanternLight(e));
  }
  e.ay -= dt;
  if (e.phase === 1 && e.hp <= e.max * KNEEL.at) kneel(e);
  const dx = hero.x - e.x;
  const ws = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const speed = enraged(e) ? SHEPHERD_WALK.enraged : SHEPHERD_WALK.speed;
    e.vx = approach(e.vx, Math.abs(dx) > SHEPHERD_WALK.stop ? e.face * speed : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") choose(e, dx);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    const windup = e.ax === AGAIN ? SHEPHERD_TIMES.again : SHEPHERD_TIMES.reap;
    if (e.st >= windup * ws.windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      reap(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= SHEPHERD_TIMES.swing) {
      if (enraged(e) && e.ax !== AGAIN)
        Object.assign(e, { state: "wind", st: 0, ax: AGAIN, face: Math.sign(dx) || e.face });
      else settle(e, SHEPHERD_DID.reap);
    }
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= tollWindup(e) * ws.windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      toll(e);
    }
  } else if (e.state === "shoot") {
    if (e.st >= SHEPHERD_TIMES.tollHold) settle(e, SHEPHERD_DID.toll);
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 400 * dt);
    const at = SHEPHERD_TIMES.call * ws.windup;
    if (e.st >= at && e.st - dt < at) callFlock(e);
    if (e.st >= at + SHEPHERD_TIMES.callHold) settle(e, SHEPHERD_DID.call);
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= SHEPHERD_TIMES.moonfall * ws.windup) {
      Object.assign(e, { state: "beam", st: 0 });
      moonfall(e);
    }
  } else if (e.state === "beam") {
    if (e.st >= SHEPHERD_TIMES.moonfallHold) settle(e, SHEPHERD_DID.moonfall);
  } else if (e.state === "burrow") {
    Object.assign(e, { vx: 0, pinned: 0, halt: 0 });
    if (e.st >= SHEPHERD_TIMES.kneel) {
      Object.assign(e, { state: "hop", st: 0 });
      rise(e);
    }
  } else if (e.state === "hop") {
    Object.assign(e, { vx: 0, pinned: 0, halt: 0 });
    if (e.st >= SHEPHERD_TIMES.rise) Object.assign(e, { state: "walk", st: 0, n: 0, cd: 0.5 * ws.cooldown });
  } else if (e.st >= SHEPHERD_TIMES.recover) {
    const share = enraged(e) ? SHEPHERD_COOLDOWN.enraged : 1;
    const cd = rng.range(SHEPHERD_COOLDOWN.least, SHEPHERD_COOLDOWN.most) * share * ws.cooldown;
    Object.assign(e, { state: "walk", st: 0, n: 0, ax: 0, cd });
  }
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 14, W - 14);
  e.y = GROUND;
  if (rng.chance(0.12 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-8, 8), e.y - rng.range(6, 40), 0, -10, rng.range(0.5, 1), {
      sparks: moonLook(false).sparks,
    });
  if (enraged(e) && e.state !== "burrow" && rng.chance(0.35 * ts)) {
    const [lx, ly] = lanternPoint(e);
    particles.spawn(PK.EMBER, lx + rng.range(-2, 2), ly, rng.range(-12, 12), -rng.range(15, 40), rng.range(0.4, 0.9), {
      sparks: moonLook(true).sparks,
    });
  }
}
