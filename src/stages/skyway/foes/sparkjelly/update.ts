import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { createDischarge, createDischargeMark, DISCHARGE } from "./discharge";

export const JELLY_HITS = { discharge: 15 } as const;
export const JELLY_TIMES = { windup: 0.95, hold: 0.3, spent: 1.15 } as const;
const DRIFT = { speed: 24, height: 36, offset: 26, reach: DISCHARGE.radius + 22 } as const;

export function updateSparkjelly(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  const pulse = Math.sin(game.t * 2.6 + e.seed);
  if (e.state === "drift") {
    const tx = hero.x - e.side * DRIFT.offset;
    const ty = hero.y - DRIFT.height + pulse * 5;
    e.vx = approach(e.vx, clamp((tx - e.x) * 0.8, -DRIFT.speed, DRIFT.speed), 40 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 0.8, -DRIFT.speed, DRIFT.speed) + pulse * 8, 50 * dt);
    e.face = Math.sign(hero.x - e.x) || e.face;
    const near = Math.hypot(hero.x - e.x, hero.y - 16 - e.y) < DRIFT.reach;
    if (e.cd <= 0 && near && foeSees(e) && hero.state !== "dead") {
      Object.assign(e, { state: "wind", st: 0 });
      game.fx.push(createDischargeMark(e, JELLY_TIMES.windup * scale.windup));
      sfx.chime(3);
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 80 * dt);
    e.vy = approach(e.vy, 0, 80 * dt);
    if (fxRng.chance(dt * 20))
      particles.spawn(PK.SPARK, e.x + fxRng.range(-7, 7), e.y + fxRng.range(-6, 10), 0, 0, 0.15, {
        sparks: SKY_SPARKS.volt,
      });
    if (e.st >= JELLY_TIMES.windup * scale.windup) {
      game.fx.push(createDischarge(e.x, e.y, JELLY_HITS.discharge * e.power));
      Object.assign(e, { state: "beam", st: 0 });
      sfx.thunder();
    }
  } else if (e.state === "beam") {
    if (e.st >= JELLY_TIMES.hold) Object.assign(e, { state: "recover", st: 0, vy: 10 });
  } else {
    e.vy = approach(e.vy, 8, 30 * dt);
    e.vx = approach(e.vx, 0, 30 * dt);
    if (e.st >= JELLY_TIMES.spent)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(2, 3.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 22);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), e.y + fxRng.range(4, 16), 0, 6, fxRng.range(0.4, 0.8), {
      col: SKY_SPARKS.jelly[1],
      size: 0.5,
    });
}
