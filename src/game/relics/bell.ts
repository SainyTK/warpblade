import { PAL } from "../../constants/palette";
import { BELL_RING, GLACIER_TOLL } from "../../constants/relics/bell";
import { ellipseRing, glow, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { hex, WHITE } from "../../utils/color";
import { clamp, ease, TAU } from "../../utils/math";
import { ovalReachesBox } from "../../utils/ovalReach";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, hero, lights, particles, progress, rng } from "../state";

/** one ring running out from where the bell rang */
interface Ring {
  x: number;
  y: number;
  /** seconds since it rang */
  t: number;
  /** its full radius */
  r: number;
  /** Glacier Toll's second ring freezes */
  freezes: boolean;
  /** foes it has already struck */
  struck: WeakSet<Enemy>;
}

interface BellMemory extends RelicMemory {
  /** seconds to the next toll */
  wait: number;
  /** seconds to Glacier Toll's second ring, or below 0 when none is due */
  echo: number;
  /** seconds since the bell last rang, for the small bell over the hero's head */
  rang: number;
  rings: Ring[];
}

function ring(m: BellMemory, r: number, freezes: boolean): void {
  const y = hero.y - BELL_RING.middle;
  m.rings.push({ x: hero.x, y, t: 0, r, freezes, struck: new WeakSet() });
  m.rang = 0;
  lights.add(hero.x, y, r * 0.8, freezes ? PAL.crystal[4] : PAL.ice[3], 0.45, 0.35);
  sfx.chime(freezes ? 6 : 3);
}

/** the ring's front sweeps over foes: each takes the blow once and is chilled, or frozen by Glacier Toll's second ring */
function strike(o: Ring, damage: number, slow: number, evolved: boolean): void {
  const front = o.r * ease.outCubic(clamp(o.t / BELL_RING.spread));
  for (const e of game.enemies) {
    if (e.hp <= 0 || o.struck.has(e) || !ovalReachesBox(o.x, o.y, front, front * BELL_RING.tall, enemyBox(e))) continue;
    o.struck.add(e);
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, damage, { source: "bell", fromX: o.x, kx: Math.sign(cx - o.x) * 40 });
    if (o.freezes) e.frozen = Math.max(e.frozen, slow * (e.rank === "minion" ? 1 : GLACIER_TOLL.bossFreezeShare));
    e.chill = Math.max(e.chill, evolved ? GLACIER_TOLL.chill : slow);
    for (let i = 0; i < (o.freezes ? 5 : 3); i++)
      particles.spawn(
        PK.FLAKE,
        cx + rng.range(-5, 5),
        cy + rng.range(-6, 6),
        rng.range(-30, 30),
        rng.range(-30, 10),
        0.6,
        {
          col: o.freezes ? WHITE : PAL.ice[4],
          size: o.freezes ? 1.6 : 1,
        },
      );
  }
}

/** Frost Bell: a cold ring runs out from the hero, hurting and chilling foes; Glacier Toll rings twice and freezes */
export const bell: RelicBehavior = {
  create: (): BellMemory => ({ wait: 0.5, echo: -1, rang: BELL_RING.bellShow, rings: [] }),
  update(memory, level, evolved, dt) {
    const m = memory as BellMemory;
    const s = relicStats("bell", level, evolved, buildStats(progress.build));
    const r = BELL_RING.radius * s.area;
    m.rang += dt;
    for (const o of m.rings) {
      o.t += dt;
      strike(o, s.damage, s.duration, evolved);
    }
    m.rings = m.rings.filter((o) => o.t < BELL_RING.spread * 1.4);
    if (hero.state === "dead") return;
    if (m.echo >= 0) {
      m.echo -= dt;
      if (m.echo < 0) ring(m, r, true);
    }
    m.wait -= dt;
    if (m.wait > 0) return;
    m.wait = s.cooldown;
    ring(m, r, false);
    if (evolved) m.echo = GLACIER_TOLL.echo;
  },
  draw(memory, _level, evolved) {
    const m = memory as BellMemory;
    place();
    for (const o of m.rings) drawRing(o);
    if (m.rang < BELL_RING.bellShow && hero.state !== "dead") drawBell(m.rang, evolved);
  },
};

/** a crisp cold ring with a pale leading edge, a darker wake and frost riding the rim; the freezing ring grows spikes */
function drawRing(o: Ring): void {
  const u = clamp(o.t / BELL_RING.spread);
  const r = o.r * ease.outCubic(u);
  const k = 1 - clamp((o.t - BELL_RING.spread * 0.6) / (BELL_RING.spread * 0.8));
  if (r < 2 || k <= 0) return;
  const ry = r * BELL_RING.tall;
  const C = o.freezes ? PAL.crystal : PAL.ice;
  ellipseRing(o.x, o.y, r, ry, C[5], k);
  ellipseRing(o.x, o.y, r - 1, ry - 0.7, C[3], k * 0.9);
  ellipseRing(o.x, o.y, r - 3, ry - 2, C[1], k * 0.45);
  const n = Math.round(r * (o.freezes ? 0.45 : 0.25));
  for (let i = 0; i < n; i++) {
    const a = (i * TAU) / n + o.t * 0.8;
    const fx = o.x + Math.cos(a) * r;
    const fy = o.y + Math.sin(a) * ry;
    if (o.freezes) {
      const out = 2 + (i % 3);
      for (let d = 1; d <= out; d++)
        px(fx + Math.cos(a) * d, fy + Math.sin(a) * d * BELL_RING.tall, C[d < out ? 4 : 6], k);
    } else px(fx + Math.cos(a) * 1.5, fy + Math.sin(a) * 1, WHITE, k * 0.8);
  }
  glow(o.x, o.y, r * 0.5, C[3], 0.2 * k * (1 - u));
}

/** BELL rows: 0 empty, 1 rim, 2 body, 3 shine, 4 clapper; a dark outline is drawn around them */
const BELL = ["0001000", "0011100", "0132210", "0132210", "0122210", "1222221", "1111111", "0004000"] as const;
const BELL_OUTLINE = hex("#0a0612");

/** the small bell over the hero's head swings from its top as it rings, and fades */
function drawBell(t: number, evolved: boolean): void {
  const k = 1 - t / BELL_RING.bellShow;
  const swing = Math.sin(t * 22) * 2.5 * k;
  const x = Math.round(hero.x) - 3;
  const y = Math.round(hero.y - BELL_RING.bellRise - (1 - k) * 3);
  const C = evolved ? PAL.crystal : PAL.ice;
  const colors = [0, C[2], C[4], WHITE, C[1]];
  const a = Math.min(1, k * 2.5);
  const at = (i: number, j: number): number => x + i + Math.round(swing * (j / BELL.length));
  for (const pass of [0, 1])
    BELL.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const v = Number(row[i]);
        if (!v) continue;
        if (pass === 1) px(at(i, j), y + j, colors[v], a);
        else for (const [dx, dy] of OUTLINE_STEPS) px(at(i, j) + dx, y + j + dy, BELL_OUTLINE, a);
      }
    });
  glow(x + 3, y + 4, 12, C[3], 0.35 * k);
}

const OUTLINE_STEPS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;
