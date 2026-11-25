import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { createPoisonCloud } from "../../spores";

export const PUFF_HITS = { cloud: 7 } as const;
export const PUFF = { swell: 0.65, provoked: 0.35, spent: 2.2, near: 34, drift: 34 } as const;
const CLOUD = { radius: 15, life: 2.6 } as const;
const DEATH_CLOUD = { radius: 12, life: 1.8 } as const;

function release(x: number, y: number, radius: number, life: number, damage: number): void {
  game.fx.push(createPoisonCloud(x, y, radius, life, damage));
  for (let i = 0; i < 14; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(30, 80);
    particles.spawn(PK.MOTE, x, y, Math.cos(a) * v, Math.sin(a) * v, fxRng.range(0.3, 0.6), {
      col: fxRng.pick(BLIGHT.spore),
      size: 0.6,
    });
  }
  sfx.chime(0.6);
}

export function puffTakes(e: Enemy, dmg: number): number {
  if (dmg >= e.hp && e.ay === 0) {
    e.ay = 1;
    release(e.x, e.y, DEATH_CLOUD.radius, DEATH_CLOUD.life, PUFF_HITS.cloud * e.power);
  }
  return dmg;
}

function burst(e: Enemy): void {
  release(e.x, e.y + 1, CLOUD.radius, CLOUD.life, PUFF_HITS.cloud * e.power);
  Object.assign(e, { state: "recover", st: 0, vy: -26, vx: -Math.sign(hero.x - e.x) * 20 });
}

export function swellTime(e: Enemy): number {
  return (e.n === 1 ? PUFF.provoked : PUFF.swell) * waveScale(game.wave).windup;
}

export function updateSporepuff(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 18;
  const dx = hx - e.x;
  const dist = Math.hypot(dx, hy - e.y);
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    const bob = Math.sin(game.t * 2.2 + e.seed) * 5;
    const tx = hx - e.side * 16 + Math.sin(game.t * 0.9 + e.seed) * 8;
    const ty = hy - 16 + bob;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -PUFF.drift, PUFF.drift), 90 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -PUFF.drift, PUFF.drift), 110 * dt);
    const struck = e.flash > 0;
    const ready = e.cd <= 0 && dist < PUFF.near && foeSees(e);
    if ((ready || struck) && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0, n: struck ? 1 : 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, clamp(dx * 0.6, -14, 14), 80 * dt);
    e.vy = approach(e.vy, 0, 120 * dt);
    if (fxRng.chance(0.5 * ts)) {
      const a = fxRng.range(0, TAU);
      particles.spawn(
        PK.MOTE,
        e.x + Math.cos(a) * 12,
        e.y + Math.sin(a) * 10,
        -Math.cos(a) * 34,
        -Math.sin(a) * 30,
        0.3,
        {
          col: BLIGHT.spore[3],
          size: 0.5,
        },
      );
    }
    if (e.st >= swellTime(e)) burst(e);
  } else {
    e.vy = approach(e.vy, -6, 40 * dt);
    if (e.st >= PUFF.spent)
      Object.assign(e, {
        state: "drift",
        st: 0,
        n: 0,
        cd: rng.range(1.6, 2.6) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 24, GROUND - 12);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-3, 3), e.y + 6, fxRng.range(-3, 3), fxRng.range(5, 12), 0.7, {
      col: BLIGHT.spore[2],
      size: 0.5,
    });
}
