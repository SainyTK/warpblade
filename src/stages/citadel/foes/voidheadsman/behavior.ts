import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createSlash } from "../../../../game/effects/slash";
import { VOID, VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy, EnemyState } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { createFloorMark } from "../floorMark";
import { createFloorWave } from "../floorWave";
import { boxAheadOf, strikeOnceBy, touchHero } from "../strike";
import { calledAlive, callMites } from "./call";
import { FISSURE, HEADSMAN, HEADSMAN_HITS, HEADSMAN_MOVE } from "./constants";
import { createRiftDoor } from "./riftDoor";

const pace = (): number => waveScale(game.wave).windup;

function enter(e: Enemy, state: EnemyState, move: number): void {
  Object.assign(e, { state, st: 0, ay: move, n: 0 });
}

function choose(e: Enemy, gap: number): void {
  const canCall = e.side !== HEADSMAN_MOVE.call && calledAlive(e) < HEADSMAN.callMost;
  if (canCall && rng.chance(0.35)) {
    enter(e, "summon", HEADSMAN_MOVE.call);
    e.side = HEADSMAN_MOVE.call;
    sfx.bossRoar();
    return;
  }
  e.side = 0;
  if (gap < HEADSMAN.chopReach) {
    enter(e, "wind", HEADSMAN_MOVE.chop);
    game.fx.push(createFloorMark(e, "wind", HEADSMAN.chopFrom, HEADSMAN.chopTo, HEADSMAN.chopWind * pace()));
    sfx.swingHeavy(0.6);
    return;
  }
  enter(e, "blink", HEADSMAN_MOVE.step);
  const side = Math.sign(hero.x - e.x) || 1;
  e.ax = clampStageX(hero.x + side * HEADSMAN.stepBehind, 24);
  game.fx.push(createRiftDoor(e, e.ax, HEADSMAN.stepWind * pace()));
  sfx.evade();
}

function stalk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const want = !foeSees(e) || gap > HEADSMAN.keep ? e.face * HEADSMAN.pace : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 100 * dt);
  if (e.cd > 0 || !facesHero(e) || gap > HEADSMAN.stepReach || hero.state === "dead") return;
  choose(e, gap);
}

function chop(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0, n: 0 });
  const x = e.x + e.face * 30;
  game.fx.push(
    createSlash(e.x, e.y, e.face, { cx: 10, cy: -24, R: 28, sy: 1, rot: 0.1, a0: -2.4, a1: 1.1, W: 9, ramp: VOID }),
  );
  game.fx.push(createFloorWave(x, e.face, HEADSMAN_HITS.fissure * e.power, FISSURE));
  game.fx.push(createFloorRing(x, GROUND, 22, VOID, 0.4));
  dust(x, GROUND, 10);
  for (let i = 0; i < 16; i++)
    particles.spawn(PK.SPARK, x, GROUND - 1, fxRng.range(-140, 140), -fxRng.range(80, 220), 0.5, {
      sparks: VOID_SPARKS,
    });
  shake(0.35, 3.5);
  sfx.boom();
}

function arrive(e: Enemy): void {
  e.x = e.ax;
  e.face = Math.sign(hero.x - e.x) || -e.face;
  enter(e, "hop", HEADSMAN_MOVE.step);
  game.fx.push(createFloorRing(e.x, GROUND, 20, VOID, 0.35));
  game.fx.push(createFloorMark(e, "hop", 0, HEADSMAN.sweepHalf, HEADSMAN.sweepWind * pace()));
  game.fx.push(createFloorMark(e, "hop", 0, -HEADSMAN.sweepHalf * 0.6, HEADSMAN.sweepWind * pace()));
  sfx.warp();
}

function sweep(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, n: 0 });
  game.fx.push(
    createSlash(e.x, e.y, e.face, { cx: 4, cy: -10, R: 40, sy: 0.25, rot: 0, a0: -2.6, a1: 0.9, W: 6, ramp: VOID }),
  );
  sfx.swingHeavy(0.7);
}

function call(e: Enemy): void {
  Object.assign(e, { state: "shoot", st: 0 });
  callMites(e);
  shake(0.15, 2);
  sfx.thunder();
}

function act(e: Enemy, ts: number): void {
  const s = e.state;
  if (s === "wind") {
    if (e.st >= HEADSMAN.chopWind * pace()) chop(e);
  } else if (s === "swipe") {
    if (e.st < 0.1)
      strikeOnceBy(
        e,
        boxAheadOf(e, HEADSMAN.chopFrom, HEADSMAN.chopTo, GROUND - 50, GROUND),
        HEADSMAN_HITS.chop * e.power,
      );
    if (e.st >= HEADSMAN.chopTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (s === "blink") {
    if (fxRng.chance(0.6 * ts))
      particles.spawn(PK.SPARK, e.x + fxRng.range(-10, 10), e.y - fxRng.range(0, 44), 0, -30, 0.3, {
        sparks: VOID_SPARKS,
      });
    if (e.st >= HEADSMAN.stepWind * pace()) arrive(e);
  } else if (s === "hop") {
    if (e.st >= HEADSMAN.sweepWind * pace()) sweep(e);
  } else if (s === "lunge") {
    if (e.st < 0.12) {
      const box = boxAheadOf(e, -HEADSMAN.sweepHalf * 0.6, HEADSMAN.sweepHalf, GROUND - HEADSMAN.sweepHeight, GROUND);
      strikeOnceBy(e, box, HEADSMAN_HITS.sweep * e.power);
    }
    if (e.st >= HEADSMAN.sweepTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (s === "summon") {
    if (fxRng.chance(0.7 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-30, 30), GROUND - 2, 0, -fxRng.range(20, 50), 0.5, {
        col: VOID[4],
        size: 0.7,
      });
    if (e.st >= HEADSMAN.callWind * pace()) call(e);
  } else if (s === "shoot") {
    if (e.st >= HEADSMAN.callTime) Object.assign(e, { state: "recover", st: HEADSMAN.recover * 0.4 });
  } else if (e.st >= HEADSMAN.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.6) * waveScale(game.wave).cooldown });
}

export function updateVoidheadsman(e: Enemy, dt: number, ts: number): void {
  if (e.state === "walk") stalk(e, dt);
  else act(e, ts);
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 24);
  e.y = GROUND;
  if (fxRng.chance(0.15 * ts))
    particles.spawn(PK.EMBER, e.x + e.face * 14 + fxRng.range(-4, 4), e.y - 40, 0, -12, 0.6, { sparks: VOID_SPARKS });
  if (e.state === "walk") touchHero(e, HEADSMAN_HITS.touch);
}

export const headsmanTakes = (e: Enemy, dmg: number): number =>
  e.state === "summon" ? dmg * HEADSMAN.summonArmour : dmg;
