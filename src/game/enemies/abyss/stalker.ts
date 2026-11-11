import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox } from "../../world";
import { foeSees } from "../awareness";
import { enemyBox } from "../enemy";
import { facesHero, turnToHero } from "../facing";
import { ABYSS_HITS, VOID, VOID_SPARKS } from "./colors";

/** the dive into its shadow: sinking, then gliding under the floor toward Kael for at most this long */
export const SINK = 0.3;
const GLIDE = 1.4;
/** the rising strike after the pool has glowed under Kael */
export const RISE = 0.28;
const CLAW_RANGE = 24;
/** e.n while burrowed: still sinking, or gliding as a shadow */
const GLIDING = 1;

/** whether the stalker is down in its shadow pool, where only low blows reach it */
export const sunk = (e: Enemy): boolean => e.state === "burrow" || e.state === "charge";

function claw(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0, vx: e.face * 50 });
  game.fx.push(
    createSlash(e.x, e.y, e.face, { cx: 5, cy: -12, R: 14, sy: 0.6, rot: 0.15, a0: -2.1, a1: 1.1, W: 6, ramp: VOID }),
  );
  const reach = e.face > 0 ? ([e.x, e.y - 26, e.x + 26, e.y] as const) : ([e.x - 26, e.y - 26, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(reach, heroBox())) hurtHero(ABYSS_HITS.stalkerClaw * e.power, e.x);
  });
  sfx.swing(0.6);
}

function rise(e: Enemy): void {
  Object.assign(e, { state: "hop", st: 0, face: Math.sign(hero.x - e.x) || e.face });
  game.fx.push(createFloorRing(e.x, GROUND, 18, VOID, 0.35));
  dust(e.x - 3, GROUND, 4, -1);
  dust(e.x + 3, GROUND, 4, 1);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, e.x + rng.range(-6, 6), GROUND - 1, rng.range(-50, 50), rng.range(-170, -80), 0.3, {
      sparks: VOID_SPARKS,
    });
  eachStanding(() => {
    if (boxHit([e.x - 10, e.y - 30, e.x + 10, e.y], heroBox())) hurtHero(ABYSS_HITS.stalkerRise * e.power, e.x);
  });
  sfx.lunge();
}

/** Void Stalkers prowl at Kael and claw him up close; from further off they melt into a shadow pool, glide under him, glow, and rise claws first */
export function updateStalker(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const ws = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, (Math.abs(dx) > 6 || !foeSees(e)) && e.halt <= 0 ? e.face * 32 : 0, 200 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      if (Math.abs(dx) < CLAW_RANGE && Math.abs(hero.y - e.y) < 30) Object.assign(e, { state: "wind", st: 0 });
      else if (Math.abs(dx) > 56 && Math.abs(dx) < 170 && !game.enemies.some((o) => o.type === "stalker" && sunk(o))) {
        Object.assign(e, { state: "burrow", st: 0, n: 0 });
        game.fx.push(createFloorRing(e.x, GROUND, 12, VOID, 0.3));
        sfx.evade();
      }
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= 0.55 * ws.windup) claw(e);
  } else if (e.state === "swipe") {
    if (e.st >= 0.2) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "burrow") {
    if (e.n !== GLIDING) {
      e.vx = approach(e.vx, 0, 400 * dt);
      if (e.st >= SINK) Object.assign(e, { st: 0, n: GLIDING });
    } else {
      e.face = Math.sign(dx) || e.face;
      e.vx = approach(e.vx, Math.sign(dx) * 95, 400 * dt);
      if (rng.chance(0.4 * ts))
        particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), GROUND - 1, -e.vx * 0.2, -rng.range(6, 20), 0.4, {
          sparks: VOID_SPARKS,
        });
      if (Math.abs(dx) < 4 || e.st >= GLIDE || hero.state === "dead")
        Object.assign(e, { state: "charge", st: 0, vx: 0 });
    }
  } else if (e.state === "charge") {
    e.vx = 0;
    if (rng.chance(0.6 * ts))
      particles.spawn(PK.SPARK, e.x + rng.range(-8, 8), GROUND - 1, 0, -rng.range(30, 70), 0.2, {
        sparks: VOID_SPARKS,
      });
    if (e.st >= 0.65 * ws.windup) rise(e);
  } else if (e.state === "hop") {
    if (e.st >= RISE) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.7) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(0.9, 1.7) * ws.cooldown });
  if (e.state !== "walk" && e.state !== "burrow") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = GROUND;
  if (!sunk(e) && rng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), e.y - rng.range(6, 18), 0, -10, rng.range(0.4, 0.8), {
      sparks: VOID_SPARKS,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(ABYSS_HITS.stalkerTouch * e.power, e.x);
  });
}
