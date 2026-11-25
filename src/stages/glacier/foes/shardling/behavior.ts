import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { SHARDLING, SHARDLING_HITS } from "./constants";
import { createIceShard } from "./shard";

const aimAt = (e: Enemy): number => Math.atan2(hero.y - 16 - e.y, Math.abs(hero.x - e.x) || 1);

function fire(e: Enemy): void {
  for (let i = -1; i <= 1; i++) {
    const local = e.ax + i * SHARDLING.spread;
    const angle = e.face > 0 ? local : Math.PI - local;
    game.fx.push(
      createIceShard(e.x + Math.cos(angle) * 8, e.y + Math.sin(angle) * 8, angle, SHARDLING_HITS.shard * e.power),
    );
  }
  for (let i = 0; i < 8; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.MOTE, e.x, e.y, Math.cos(a) * 50, Math.sin(a) * 50, 0.3, { col: FOE.crystal[3], size: 0.6 });
  }
  sfx.chime(2);
}

export function updateShardling(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    const tx = hero.x - e.side * SHARDLING.hover + Math.sin(game.t * 0.9 + e.seed) * 12;
    const ty = hero.y - SHARDLING.height + Math.sin(game.t * 2.3 + e.seed) * 6;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.3, -55, 55), 180 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -55, 55), 200 * dt);
    if (e.cd <= 0 && Math.abs(dx) < 120 && hero.state !== "dead" && foeSees(e))
      Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (e.st < SHARDLING.wind * scale.windup * 0.7) {
      e.face = Math.sign(dx) || e.face;
      e.ax = aimAt(e);
    }
    if (fxRng.chance(0.5 * ts)) {
      const a = fxRng.range(0, TAU);
      particles.spawn(
        PK.MOTE,
        e.x + Math.cos(a) * 12,
        e.y + Math.sin(a) * 12,
        -Math.cos(a) * 36,
        -Math.sin(a) * 36,
        0.3,
        {
          col: FOE.crystal[4],
          size: 0.5,
        },
      );
    }
    if (e.st >= SHARDLING.wind * scale.windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      fire(e);
    }
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, -e.face * 30, 300 * dt);
    if (e.st >= SHARDLING.hold) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vy = approach(e.vy, clamp((hero.y - 30 - e.y) * 1.2, -25, 25), 100 * dt);
    if (e.st >= SHARDLING.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(2, 3.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 16, GROUND - 14);
  if (fxRng.chance(0.1 * ts))
    particles.spawn(PK.FLAKE, e.x + fxRng.range(-4, 4), e.y + 8, fxRng.range(-4, 4), fxRng.range(8, 16), 0.7, {
      col: FOE.crystal[3],
    });
}
