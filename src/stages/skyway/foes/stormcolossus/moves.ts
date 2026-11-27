import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { calledAlive, callFinches } from "./call";
import { COLOSSUS as K } from "./colors";
import { CALL, COLOSSUS_HITS, SLAM, STRIDE } from "./constants";
import { createShockwave } from "./shockwave";
import { createSlamMark } from "./slamMark";

const callReady = new WeakMap<Enemy, number>();

function stride(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const goal = e.halt > 0 || (foeSees(e) && gap < STRIDE.keep) ? 0 : e.face * STRIDE.speed;
  e.vx = approach(e.vx, goal, 80 * dt);
  const ready = (callReady.get(e) ?? 0) <= game.t;
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  const level = Math.abs(hero.y - e.y) < 40;
  if (gap < SLAM.near && level) {
    Object.assign(e, { state: "wind", st: 0, n: 0 });
    game.fx.push(createSlamMark(e, SLAM.windup * waveScale(game.wave).windup));
    sfx.swingHeavy(0.6);
  } else if (ready && gap > CALL.near && gap < CALL.far && calledAlive() < CALL.most) {
    Object.assign(e, { state: "summon", st: 0, n: 0 });
    callReady.set(e, game.t + CALL.every);
    sfx.chime(1);
  }
}

function slam(e: Enemy): void {
  game.fx.push(createShockwave(e.x, COLOSSUS_HITS.slam * e.power));
  dust(e.x - 10, GROUND, 6, -1);
  dust(e.x + 10, GROUND, 6, 1);
  shake(0.25, 2.5);
  sfx.boom();
  eachStanding(() => {
    if (boxHit([e.x - 16, e.y - 20, e.x + 16, e.y], heroBox())) hurtHero(COLOSSUS_HITS.slam * e.power, e.x);
  });
}

function vent(e: Enemy, ts: number): void {
  if (!fxRng.chance(0.3 * ts)) return;
  particles.spawn(PK.VAPOUR, e.x + fxRng.range(-6, 6), e.y - 30, fxRng.range(-10, 10), -fxRng.range(14, 30), 0.9, {
    col: K.vapour[2],
  });
}

export function updateStormcolossus(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") stride(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (fxRng.chance(dt * 16))
      particles.spawn(PK.SPARK, e.x + fxRng.range(-8, 8), e.y - 46, 0, -fxRng.range(10, 30), 0.2, {
        sparks: SKY_SPARKS.volt,
      });
    if (e.st >= SLAM.windup * scale.windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      slam(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= SLAM.hold) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.n === 0 && e.st >= CALL.windup * scale.windup) {
      e.n = 1;
      callFinches(e);
    }
    if (e.st >= CALL.windup * scale.windup + CALL.recover)
      Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.6) * scale.cooldown });
  } else {
    vent(e, ts);
    if (e.st >= SLAM.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * scale.cooldown });
  }
  e.vx -= e.state === "walk" ? 0 : e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit([e.x - 8, e.y - 30, e.x + 8, e.y], heroBox()))
      hurtHero(COLOSSUS_HITS.touch * e.power, e.x);
  });
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.VAPOUR, e.x - e.face * 10, e.y - 34, -e.face * 8, -12, 0.8, { col: K.vapour[1] });
}
