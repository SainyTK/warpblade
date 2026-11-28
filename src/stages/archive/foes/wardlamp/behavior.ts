import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE_SPARKS } from "../colors";
import { grantWard } from "../lampWard";
import { createDrip, createDripMark } from "./drip";
import { DRIP, WARDLAMP, WARDLAMP_HITS } from "./moves";
import { pickWardTarget, wardTarget } from "./target";
import { createTether } from "./tether";

const fallTime = (from: number): number => Math.sqrt((2 * Math.max(0, GROUND - from)) / DRIP.gravity);
const dropX = (e: Enemy, i: number): number => clampStageX(e.ax + (i - (WARDLAMP.drops - 1) / 2) * WARDLAMP.spacing, 8);

function glide(e: Enemy, tx: number, ty: number, dt: number, pace: number = WARDLAMP.pace): void {
  e.vx = approach(e.vx, clamp((tx - e.x) * 2, -pace, pace), 160 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 2, -pace, pace), 160 * dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 22);
}

function drift(e: Enemy, dt: number): void {
  e.face = Math.sign(hero.x - e.x) || e.face;
  const sway = Math.sin(game.t * 0.9 + e.seed) * 10;
  glide(e, hero.x + e.side * WARDLAMP.side + sway, hero.y - WARDLAMP.hover + Math.sin(game.t * 1.7 + e.seed) * 4, dt);
  if (hero.state === "dead" || !foeSees(e)) return;
  if (e.n <= 0) {
    const ally = pickWardTarget(e);
    e.n = WARDLAMP.wardEvery;
    if (ally) {
      Object.assign(e, { state: "summon", st: 0 });
      game.fx.push(createTether(e, ally, WARDLAMP.wardCast));
      sfx.chime(1);
      return;
    }
  }
  if (e.cd <= 0 && Math.abs(hero.x - e.x) < WARDLAMP.reach + WARDLAMP.side)
    Object.assign(e, { state: "wind", st: 0, ay: 0, ax: hero.x });
}

function pour(e: Enemy, dt: number, ts: number): void {
  const windup = WARDLAMP.pour * waveScale(game.wave).windup;
  const lockAt = windup * WARDLAMP.lock;
  if (e.st < lockAt) e.ax = approach(e.ax, hero.x, 140 * dt);
  glide(e, e.ax, hero.y - WARDLAMP.hover, dt, WARDLAMP.pace * 1.4);
  if (fxRng.chance(0.6 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-3, 3), e.y - 2, fxRng.range(-10, 10), -fxRng.range(10, 30), 0.4, {
      sparks: FOE_SPARKS.flame,
    });
  if (e.ay === 0 && e.st >= lockAt) {
    e.ay = 1;
    const fall = fallTime(e.y + 10);
    for (let i = 0; i < WARDLAMP.drops; i++)
      game.fx.push(createDripMark(dropX(e, i), windup - e.st + i * WARDLAMP.between + fall));
  }
  if (e.st >= windup) Object.assign(e, { state: "shoot", st: 0, ay: 0 });
}

function release(e: Enemy): void {
  const due = Math.min(WARDLAMP.drops, Math.floor(e.st / WARDLAMP.between) + 1);
  while (e.ay < due) {
    game.fx.push(createDrip(dropX(e, e.ay), e.y + 10, WARDLAMP_HITS.drip * e.power));
    e.ay++;
    sfx.swing(2.2);
  }
  if (e.st >= WARDLAMP.shoot) Object.assign(e, { state: "recover", st: 0 });
}

export function updateWardlamp(e: Enemy, dt: number, ts: number): void {
  e.n = Math.max(0, e.n - dt);
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "summon") {
    e.vx -= e.vx * 4 * dt;
    e.vy -= e.vy * 4 * dt;
    if (e.st >= WARDLAMP.wardCast) {
      const ally = wardTarget(e);
      if (ally && ally.hp > 0) grantWard(ally, e, WARDLAMP.ward);
      sfx.chime(4);
      Object.assign(e, { state: "drift", st: 0, cd: Math.max(e.cd, 0.8) });
    }
  } else if (e.state === "wind") pour(e, dt, ts);
  else if (e.state === "shoot") release(e);
  else {
    const sinking = e.st < WARDLAMP.recover - 0.35;
    glide(e, e.x, hero.y - (sinking ? WARDLAMP.sag : WARDLAMP.hover), dt, sinking ? 40 : 60);
    if (e.st >= WARDLAMP.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
}
