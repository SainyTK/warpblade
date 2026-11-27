import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { aimTarget } from "./aim";
import { createAimLine } from "./aimLine";
import { VOLT_SPARKS } from "./colors";
import { VOLTFLY, VOLTFLY_HITS } from "./constants";

export const aimTime = (): number => VOLTFLY.aim * waveScale(game.wave).windup;

function hover(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const tx = hero.x - e.side * (VOLTFLY.hover + ((e.seed * 5) % 18));
  const ty = hero.y - VOLTFLY.rise - ((e.seed * 3) % 14) + Math.sin(game.t * 2.6 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.8, -VOLTFLY.drift, VOLTFLY.drift), 260 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -VOLTFLY.drift, VOLTFLY.drift), 260 * dt);
  const near = Math.abs(hero.x - e.x) < VOLTFLY.reach;
  if (e.cd > 0 || !near || hero.state === "dead" || !foeSees(e)) return;
  e.face = Math.sign(hero.x - e.x) || e.face;
  const [ax, ay] = aimTarget(e);
  Object.assign(e, { state: "wind", st: 0, ax, ay });
  game.fx.push(createAimLine(e, aimTime()));
  sfx.chime(4);
}

function aim(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  e.vy = approach(e.vy, 0, 400 * dt);
  if (e.st < aimTime() * VOLTFLY.lockAt) {
    const [ax, ay] = aimTarget(e);
    e.ax = ax;
    e.ay = ay;
    e.face = Math.sign(ax - e.x) || e.face;
  }
  if (e.st < aimTime()) return;
  const dx = e.ax - e.x;
  const dy = e.ay - e.y;
  const len = Math.hypot(dx, dy) || 1;
  Object.assign(e, { state: "charge", st: 0, n: 0, vx: (dx / len) * VOLTFLY.speed, vy: (dy / len) * VOLTFLY.speed });
  sfx.swing(1.4);
}

function dart(e: Enemy): void {
  if (fxRng.chance(0.6))
    particles.spawn(PK.SPARK, e.x - e.face * 8, e.y, -e.vx * 0.1, -e.vy * 0.1, 0.2, { sparks: VOLT_SPARKS });
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(VOLTFLY_HITS.dart * e.power, e.x - e.face * 10);
  });
  const passed = (e.ax - e.x) * Math.sign(e.vx || e.face) <= 0 && Math.abs(e.ay - e.y) < 8;
  const low = e.y >= GROUND - 12 && e.vy > 0;
  if (passed || low || e.st >= VOLTFLY.dartMost) Object.assign(e, { state: "recover", st: 0 });
}

function settle(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, VOLTFLY.brake * dt);
  e.vy = approach(e.vy, -20, VOLTFLY.brake * dt);
  if (e.st < VOLTFLY.recover) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.4, 2.4) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

function sting(e: Enemy): void {
  if (e.state !== "drift" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(VOLTFLY_HITS.touch * e.power, e.x);
  });
}

export function updateVoltfly(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") aim(e, dt);
  else if (e.state === "charge") dart(e);
  else settle(e, dt);
  if (e.state === "drift") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  sting(e);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.SPARK, e.x - e.face * fxRng.range(6, 16), e.y + 1, 0, 12, 0.2, { sparks: VOLT_SPARKS });
}
