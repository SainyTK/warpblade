import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE_SPARKS } from "../../colors";
import { createPour } from "./pour";

export const DRONE_HITS = { pour: 17 } as const;
export const DRONE_TIMES = { track: 0.6, aim: 0.55, pour: 0.5, recover: 1.5 } as const;
const DRONE_MOVE = { hover: 58, side: 36, reach: 130, track: 70, sag: 22, top: 26, lip: 9 } as const;

export const lipOf = (e: Enemy): number => e.y + DRONE_MOVE.lip;

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * DRONE_MOVE.side + Math.sin(game.t * 0.9 + e.seed) * 14;
  const ty = hero.y - DRONE_MOVE.hover + Math.sin(game.t * 2.2 + e.seed) * 3;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -50, 50), 120 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.5, -40, 40), 140 * dt);
  if (e.cd <= 0 && Math.abs(dx) < DRONE_MOVE.reach && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0, n: 0 });
}

function aim(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  const track = DRONE_TIMES.track * scale.windup;
  if (e.st < track) {
    e.vx = approach(e.vx, clamp((hero.x - e.x) * 4, -DRONE_MOVE.track, DRONE_MOVE.track), 300 * dt);
    e.vy = approach(e.vy, clamp((hero.y - DRONE_MOVE.hover - e.y) * 2, -40, 40), 160 * dt);
  } else {
    e.vx = approach(e.vx, 0, 400 * dt);
    e.vy = approach(e.vy, 0, 400 * dt);
    if (e.n === 0) {
      e.n = 1;
      const mark = DRONE_TIMES.aim * scale.windup;
      game.fx.push(createPour(e, { x: e.x + e.face * 2, top: lipOf(e), mark, damage: DRONE_HITS.pour * e.power }));
      sfx.swing(0.6);
    }
  }
  if (fxRng.chance(0.3 * ts))
    particles.spawn(PK.SMOKE, e.x, e.y - 12, fxRng.range(-6, 6), -12, 0.5, { col: 0x3a2c28, size: 1.5 });
  if (e.st >= track + DRONE_TIMES.aim * scale.windup) Object.assign(e, { state: "shoot", st: 0 });
}

export function updateCrucibledrone(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") aim(e, dt, ts);
  else if (e.state === "shoot") {
    e.vx = 0;
    e.vy = approach(e.vy, -6, 100 * dt);
    if (e.st >= DRONE_TIMES.pour) Object.assign(e, { state: "recover", st: 0 });
  } else {
    const sag = hero.y - DRONE_MOVE.hover + DRONE_MOVE.sag;
    e.vx = approach(e.vx, 0, 100 * dt);
    e.vy = approach(e.vy, clamp((sag - e.y) * 2, -30, 30), 120 * dt);
    if (fxRng.chance(0.6 * ts))
      particles.spawn(PK.SMOKE, e.x + fxRng.range(-4, 4), e.y - 4, fxRng.range(-8, 8), -fxRng.range(8, 20), 0.6, {
        col: 0x40302c,
        size: fxRng.range(1.2, 2.2),
      });
    if (e.st >= DRONE_TIMES.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.6, 2.6) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, DRONE_MOVE.top, GROUND - 24);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-3, 3), lipOf(e), fxRng.range(-4, 4), fxRng.range(4, 10), 0.4, {
      sparks: FORGE_SPARKS.ember,
    });
}
