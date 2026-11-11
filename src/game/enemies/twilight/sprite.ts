import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp, TAU } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game, hero, particles, rng } from "../../state";
import { foeSees } from "../awareness";
import { PRISM } from "./colors";
import { createPrismFlash } from "./prismFlash";
import { createPrismShard } from "./prismShard";

/** sprite blows before wave scaling */
export const SPRITE_HITS = { shard: 9 } as const;
/** the blink: fade out, jump, fade back in */
export const BLINK = { out: 0.18, back: 0.36 } as const;
const SHARD_SPEED = 135;
const FAN = 0.28;
/** the reach of the flash of light as the shards leave, in art pixels */
const MUZZLE = 10;

function sparkleBurst(x: number, y: number): void {
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU + rng.range(-0.2, 0.2);
    const sp = rng.range(30, 70);
    particles.spawn(PK.MOTE, x, y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.4), {
      col: PRISM[i % PRISM.length],
      size: 0.6,
    });
  }
  particles.spawn(PK.STAR, x, y, 0, 0, 0.3, { col: PRISM[0], size: 3 });
}

function fire(e: Enemy): void {
  const dx = hero.x - e.x;
  const dy = hero.y - 16 - e.y;
  const a = Math.atan2(dy, dx);
  for (let i = -1; i <= 1; i++) {
    const g = a + i * FAN;
    game.fx.push(
      createPrismShard(
        e.x + e.face * 3,
        e.y,
        Math.cos(g) * SHARD_SPEED,
        Math.sin(g) * SHARD_SPEED,
        SPRITE_HITS.shard * e.power,
        PRISM[i + 1],
      ),
    );
  }
  game.fx.push(createPrismFlash(e.x + e.face * 4, e.y, PRISM[1], MUZZLE));
  sfx.chime(2);
}

/** Prism Sprites hover off to Kael's side, blink to a fresh spot near him, gather light and fire a fan of three shards */
export function updateSprite(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 18;
  const dx = hx - e.x;
  const d = Math.hypot(dx, hy - e.y);
  if (e.state === "drift") {
    const tx = hx - e.side * 56;
    const ty = hy - 20 + Math.sin(game.t * 2.1 + e.seed) * 8;
    e.face = Math.sign(dx) || e.face;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -60, 60), 200 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -50, 50), 200 * dt);
    if (e.cd <= 0 && d < 130 && hero.state !== "dead" && foeSees(e)) {
      const side = rng.chance(0.5) ? 1 : -1;
      Object.assign(e, {
        state: "blink",
        st: 0,
        n: 0,
        ax: clamp(hx + side * rng.range(42, 66), 12, W - 12),
        ay: clamp(hy - rng.range(12, 34), 22, GROUND - 24),
      });
      sparkleBurst(e.x, e.y);
      sfx.evade();
    }
  } else if (e.state === "blink") {
    e.vx = 0;
    e.vy = 0;
    if (e.n === 0 && e.st >= BLINK.out) {
      Object.assign(e, { x: e.ax, y: e.ay, n: 1 });
      sparkleBurst(e.x, e.y);
    }
    if (e.st >= BLINK.back) Object.assign(e, { state: "wind", st: 0, face: Math.sign(hero.x - e.x) || e.face });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    e.vy = approach(e.vy, 0, 300 * dt);
    if (rng.chance(0.5 * ts)) {
      const a = rng.range(0, TAU);
      particles.spawn(
        PK.MOTE,
        e.x + Math.cos(a) * 10,
        e.y + Math.sin(a) * 10,
        -Math.cos(a) * 50,
        -Math.sin(a) * 50,
        0.2,
        {
          col: rng.pick(PRISM),
          size: 0.5,
        },
      );
    }
    if (e.st >= 0.55 * waveScale(game.wave).windup) {
      Object.assign(e, { state: "shoot", st: 0, vx: -e.face * 40 });
      fire(e);
    }
  } else if (e.state === "shoot") {
    if (e.st >= 0.25) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.5)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.5, 2.6) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  if (e.state !== "blink" && rng.chance(0.12 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-4, 4), e.y + 3, 0, rng.range(4, 12), rng.range(0.3, 0.6), {
      sparks: [PRISM[0], PRISM[1], PRISM[3]],
    });
}
