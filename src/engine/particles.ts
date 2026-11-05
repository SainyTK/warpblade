// Particle kinds, their motion and their look are adapted from Sprite Fusion's open-source pixel art VFX
// (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
import { FIRE_RAMP, SMOKE_RAMP, SPARKS } from "../constants/palette";
import { GROUND } from "../constants/stage";
import type { Color, Ramp } from "../types/color";
import { type Particle, type ParticleKind, PF, PK } from "../types/particle";
import { mix, rampAt, scale, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";
import type { Rng } from "../utils/rng";
import { circle, disc, fleck, glow, hairline, line, place, px, sparkle } from "./frame";

const GRAVITY = 950;
const MAX_PARTICLES = 1800;
const SOFT = new Set<ParticleKind>([PK.VAPOUR, PK.DUST, PK.SMOKE]);
const CROSS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

export interface SpawnOptions {
  col?: Color;
  size?: number;
  delay?: number;
  flag?: number;
  sparks?: Ramp;
}

/**
 * Sparks streak with speed, fall and bounce; smoke swells, rises and thins; fire cools down its ramp into smoke;
 * shards tumble and settle. "back" draws the soft kinds (vapour, dust, smoke), "front" the rest.
 */
export class Particles {
  private list: Particle[] = [];
  private t = 0;
  /** called where a burning chunk lands */
  onLand: ((x: number, y: number) => void) | null = null;
  constructor(private readonly rng: Rng) {}

  get count(): number {
    return this.list.length;
  }
  spawn(k: ParticleKind, x: number, y: number, vx: number, vy: number, life: number, o: SpawnOptions = {}): void {
    if (this.list.length >= MAX_PARTICLES) return;
    const R = this.rng;
    this.list.push({
      k,
      x,
      y,
      vx,
      vy,
      life,
      max: life,
      col: o.col ?? WHITE,
      size: o.size ?? 1,
      seed: R.next() * 100,
      delay: o.delay ?? 0,
      flag: o.flag ?? 0,
      sparks: o.sparks ?? SPARKS.hot,
      a: R.range(0, TAU),
      va: R.range(-16, 16),
    });
  }

  update(dt: number): void {
    this.t += dt;
    const R = this.rng;
    const t = this.t;
    // particles spawned during the step land in the fresh list and move from the next frame
    const current = this.list;
    this.list = [];
    for (const p of current) {
      if (p.delay > 0) {
        p.delay -= dt;
        this.list.push(p);
        continue;
      }
      p.life -= dt;
      if (p.life <= 0) {
        if (p.k === PK.FIRE && p.flag & PF.SMOKES) {
          const big = p.flag & PF.BIG;
          this.spawn(PK.SMOKE, p.x, p.y, p.vx * 0.6, p.vy * 0.6 - 6, big ? R.range(1.3, 2.3) : R.range(0.8, 1.4), {
            col: 0,
            size: p.size * (big ? 0.85 : 0.7),
            flag: big ? PF.BIG : 0,
          });
        }
        continue;
      }
      if (this.step(p, dt, t)) this.list.push(p);
    }
  }

  /** move one particle; false removes it */
  private step(p: Particle, dt: number, t: number): boolean {
    const R = this.rng;
    switch (p.k) {
      case PK.FIRE:
        p.vy -= 95 * dt;
        p.vx += Math.sin(t * 17 + p.seed) * 30 * dt;
        p.vx -= p.vx * 5 * dt;
        p.vy -= p.vy * 3.2 * dt;
        break;
      case PK.BRAND: {
        p.vy += GRAVITY * 0.8 * dt;
        p.vx -= p.vx * 0.9 * dt;
        if (R.chance(0.5)) {
          const size = R.range(0.9, 1.7) * (0.5 + (p.life / p.max) * 0.6);
          this.spawn(PK.FIRE, p.x, p.y, p.vx * 0.1 + R.range(-7, 7), p.vy * 0.1 - 10, R.range(0.16, 0.32), {
            col: 0,
            size,
            flag: R.chance(0.4) ? PF.SMOKES : 0,
          });
        }
        const ny = p.y + p.vy * dt;
        p.x += p.vx * dt;
        if (p.vy > 0 && ny >= GROUND) {
          this.onLand?.(p.x, GROUND);
          return false;
        }
        p.y = ny;
        return true;
      }
      case PK.SPARK: {
        p.vy += GRAVITY * 0.45 * dt;
        p.vx -= p.vx * 2.2 * dt;
        p.vy -= p.vy * 2.2 * dt;
        const ny = p.y + p.vy * dt;
        p.x += p.vx * dt;
        if (p.vy > 0 && p.y <= GROUND && ny >= GROUND) {
          p.vy = -p.vy * 0.45;
          p.vx *= 0.7;
          p.y = GROUND - 0.25;
        } else p.y = ny;
        return true;
      }
      case PK.SHARD: {
        p.vy += GRAVITY * 0.8 * dt;
        p.vx -= p.vx * 0.5 * dt;
        p.a += p.va * dt;
        const ny = p.y + p.vy * dt;
        p.x += p.vx * dt;
        if (p.vy > 0 && ny >= GROUND - 0.5) {
          p.y = GROUND - 0.5;
          p.vy = -p.vy * 0.3;
          p.vx *= 0.6;
          p.va *= 0.5;
          if (Math.abs(p.vy) < 25) {
            p.vy = 0;
            p.va = 0;
            p.vx *= 0.5;
          }
        } else p.y = ny;
        return true;
      }
      case PK.STREAK:
        p.vx += p.vx * 3 * dt;
        p.vy += p.vy * 3 * dt;
        break;
      case PK.FLAKE:
        p.vx -= p.vx * 2.2 * dt;
        p.vy -= p.vy * 2.2 * dt - 35 * dt;
        p.x += Math.sin(t * 2.5 + p.seed) * 7 * dt;
        break;
      case PK.EMBER:
        p.vy += (-30 + Math.sin(t * 3 + p.seed) * 20) * dt;
        p.vx += Math.cos(t * 2.3 + p.seed) * 45 * dt;
        p.vx -= p.vx * 1.6 * dt;
        p.vy -= p.vy * 1.6 * dt;
        break;
      case PK.SMOKE: {
        const big = p.flag & PF.BIG;
        p.vy -= (big ? 23 : 16) * dt;
        p.vx += Math.sin(t * 1.3 + p.seed) * 8 * dt;
        p.vx -= p.vx * 1.6 * dt;
        p.vy -= p.vy * 1.2 * dt;
        break;
      }
      case PK.MOTE:
        p.vx -= p.vx * 0.6 * dt;
        p.vy -= p.vy * 0.6 * dt;
        break;
      default: {
        const drag = SOFT.has(p.k) ? 4 : 1.6;
        p.vx -= p.vx * drag * dt;
        p.vy -= p.vy * drag * dt + 5 * dt;
      }
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    return true;
  }

  draw(layer: "back" | "front"): void {
    place();
    for (const q of this.list) {
      if (q.delay > 0) continue;
      if ((SOFT.has(q.k) ? "back" : "front") !== layer) continue;
      this.drawOne(q);
    }
  }

  private drawOne(q: Particle): void {
    const k = q.life / q.max;
    const { x, y } = q;
    const sp = Math.hypot(q.vx, q.vy) || 1;
    const ux = q.vx / sp;
    const uy = q.vy / sp;
    switch (q.k) {
      case PK.SPARK: {
        const S = q.sparks;
        const head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2];
        const len = Math.min(9, 1 + sp * 0.022);
        // a fine tail behind a full head with a white-hot point
        hairline(x - ux * len, y - uy * len, x - ux * len * 0.4, y - uy * len * 0.4, k > 0.5 ? head : S[S.length - 1]);
        line(x - ux * len * 0.45, y - uy * len * 0.45, x, y, head);
        if (k > 0.5) fleck(x + 0.25, y + 0.25, WHITE);
        glow(x, y, 3, head, 0.45 * k);
        break;
      }
      case PK.MOTE: {
        const len = Math.min(16, 0.5 + sp * 0.026) * q.size;
        const a = k < 0.35 ? k / 0.35 : 1;
        hairline(x - ux * len, y - uy * len, x - ux * len * 0.35, y - uy * len * 0.35, scale(q.col, 0.55), a);
        if (q.size < 1) hairline(x - ux * len * 0.4, y - uy * len * 0.4, x, y, q.col, a);
        else line(x - ux * len * 0.4, y - uy * len * 0.4, x, y, q.col, a);
        glow(x, y, 2.5 + q.size, q.col, 0.4 * k);
        break;
      }
      case PK.STREAK: {
        const L = clamp(sp / 30, 1, 7);
        // a full art pixel near the head, thinning to a single image pixel down the tail
        for (let d = L; d >= 0; d -= 0.25) {
          const c = d < 1 ? WHITE : d < L * 0.5 ? q.col : scale(q.col, 0.6);
          if (d < L * 0.5) px(x - ux * d, y - uy * d, c);
          else fleck(x - ux * d + 0.25, y - uy * d + 0.25, c, 1.2 - d / L);
        }
        glow(x, y, 4, q.col, 0.4);
        break;
      }
      case PK.FLAKE: {
        const a = Math.min(1, k * 3);
        px(x, y, q.col, a);
        if (q.size > 1.3) for (const [dx, dy] of CROSS) px(x + dx, y + dy, scale(q.col, 0.8), a * 0.8);
        glow(x, y, 3, q.col, 0.15 * a);
        break;
      }
      case PK.VAPOUR: {
        const r = q.size * (0.6 + (1 - k) * 0.9);
        disc(x, y, r, q.col, k ** 1.3 * 0.4);
        glow(x, y, r * 1.8, q.col, 0.1 * k);
        break;
      }
      case PK.DUST:
        disc(x, y, q.size * (0.6 + (1 - k) * 0.9), q.col, k ** 1.3 * 0.6);
        break;
      case PK.SMOKE: {
        // three soft discs: a body, a denser core sitting low, a lit cap while it is young
        const age = 1 - k;
        const big = q.flag & PF.BIG;
        const r = q.size * (0.65 + Math.min(1, age * 2.5) * 0.45 + age * (big ? 0.5 : 0.4));
        const a = Math.min(1, age * 12) * Math.min(1, k * 2.4) * (big ? 0.7 : 0.58);
        const c = q.col ? mix(q.col, rampAt(SMOKE_RAMP, age), age) : rampAt(SMOKE_RAMP, age * 1.05);
        disc(x, y, r, c, a * 0.45);
        disc(x + r * 0.05, y + r * 0.06, r * 0.74, c, a * 0.62);
        if (age < 0.5) disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(c, WHITE, 0.12), a * 0.4 * (1 - age * 2));
        break;
      }
      case PK.FIRE: {
        // a ball of flame cooling as it rises: a darker rim, a lit core, a tongue on top
        const age = 1 - k;
        const F = FIRE_RAMP;
        const n = F.length;
        const heat = Math.min(0.999, age ** 0.62 + (q.seed % 1) * 0.1);
        const idx = Math.min(n - 2, Math.floor(heat * (n - 1)));
        const r = q.size * (0.55 + 0.45 * Math.min(1, age * 7)) * (1 - age * 0.55);
        const c = F[idx];
        if (idx >= n - 2) {
          disc(x, y, r, c, Math.min(1, k * 3) * 0.85);
          break;
        }
        circle(x, y, r, F[Math.min(n - 1, idx + 2)]);
        circle(x - r * 0.16, y - r * 0.22, r * 0.78, c);
        if (r > 1.6) circle(x, y - r * 0.9, r * 0.42, c);
        if (idx <= 3 && r > 1.8) circle(x - r * 0.28, y - r * 0.34, r * 0.36, F[Math.max(0, idx - 1)]);
        if (idx < 6) glow(x, y, r * 2.4 + 2, c, 0.18 * k);
        break;
      }
      case PK.BRAND:
        circle(x, y, 1.6, SPARKS.hot[3]);
        px(x, y, Math.sin(this.t * 40 + q.seed) > 0 ? SPARKS.hot[0] : SPARKS.hot[1]);
        glow(x, y, 7, SPARKS.hot[2], 0.45);
        break;
      case PK.EMBER: {
        const S = q.sparks;
        const c = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2];
        if (k < 0.25 && Math.sin(this.t * 40 + q.seed) < 0) break;
        px(x, y, c);
        glow(x, y, 3 + q.size, c, 0.35 * k);
        break;
      }
      case PK.SHARD: {
        const cx = Math.cos(q.a) * q.size * 0.5;
        const cy = Math.sin(q.a) * q.size * 0.5;
        const a = k < 0.3 ? k / 0.3 : 1;
        line(x - cx, y - cy, x + cx, y + cy, q.col, a);
        hairline(x - cx * 0.6, y - cy * 0.6 - 0.25, x + cx * 0.6, y + cy * 0.6 - 0.25, scale(q.col, 1.35), a);
        if (k > 0.5) fleck(x + cx + 0.25, y + cy + 0.25, WHITE, a);
        glow(x, y, 3, q.col, 0.2 * k);
        break;
      }
      default: {
        // STAR: a twinkling cross
        const tw = 0.6 + 0.4 * Math.sin(this.t * (8 + (q.seed % 5)) + q.seed);
        if (q.size < 1) {
          if (tw * k > 0.25) fleck(x + 0.25, y + 0.25, tw > 0.8 ? WHITE : q.col);
          glow(x, y, 3, q.col, 0.4 * k * tw);
          break;
        }
        sparkle(x, y, q.size * tw * Math.min(1, k * 3), q.col, scale(q.col, 0.75), 0.5 * k * tw);
      }
    }
  }
}
