import { FIRE_RAMP, PAL, SPARKS } from "../../constants/palette";
import { AURA_REACH, SUN_HEART_HEAL } from "../../constants/relics/aura";
import { glow, place, px } from "../../engine/frame";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Color } from "../../types/color";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { scale } from "../../utils/color";
import { TAU } from "../../utils/math";
import { ovalReachesBox } from "../../utils/ovalReach";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, hero, lights, particles, progress, rng } from "../state";

interface AuraMemory extends RelicMemory {
  /** seconds to the next burn */
  wait: number;
  /** seconds since the last burn, for its flare */
  since: number;
  /** HP Sun Heart may still give back this second */
  heal: number;
  /** seconds since Sun Heart last healed, for the green flare */
  healed: number;
}

/** how long a burn's flare shows on the ring */
const FLARE = 0.22;

const radiusOf = (level: number, evolved: boolean): number =>
  AURA_REACH.radius * relicStats("aura", level, evolved, buildStats(progress.build)).area;

/** the burning oval around the hero's middle */
function reaches(e: Parameters<typeof enemyBox>[0], r: number): boolean {
  return ovalReachesBox(hero.x, hero.y - AURA_REACH.middle, r, r * AURA_REACH.tall, enemyBox(e));
}

/** Sun Heart: every foe that fell inside the ring gives back a little HP, up to the cap each second */
function healFromKills(m: AuraMemory, r: number): void {
  const max = progress.stats.hp;
  for (const e of game.enemies) {
    if (e.hp > 0 || !reaches(e, r) || m.heal <= 0) continue;
    const gain = Math.min(max * SUN_HEART_HEAL.perKill, m.heal);
    m.heal -= gain;
    hero.hp = Math.min(max, hero.hp + gain);
    m.healed = 0;
    const [cx, cy] = enemyCenter(e);
    for (let i = 0; i < 3; i++)
      particles.spawn(PK.STAR, cx + rng.range(-4, 4), cy + rng.range(-4, 4), (hero.x - cx) * 1.6, -40, 0.5, {
        col: PAL.heal[3],
        size: 0.8,
      });
  }
}

function burn(damage: number, r: number, evolved: boolean): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !reaches(e, r)) continue;
    dealDamage(e, damage, { source: "aura", fromX: hero.x, dot: true });
    const [cx, cy] = enemyCenter(e);
    particles.spawn(PK.FIRE, cx + rng.range(-4, 4), cy + rng.range(-2, 6), 0, -20, rng.range(0.2, 0.35), {
      col: 0,
      size: evolved ? 2 : 1.4,
    });
  }
}

/** Ember Aura: a ring of embers at the hero's feet burns every foe close by; Sun Heart burns hotter and heals on kills */
export const aura: RelicBehavior = {
  create: (): AuraMemory => ({ wait: 0, since: FLARE, heal: 0, healed: 1 }),
  update(memory, level, evolved, dt) {
    const m = memory as AuraMemory;
    const s = relicStats("aura", level, evolved, buildStats(progress.build));
    const r = AURA_REACH.radius * s.area;
    m.since += dt;
    m.healed += dt;
    if (evolved) {
      m.heal = Math.min(progress.stats.hp * SUN_HEART_HEAL.cap, m.heal + progress.stats.hp * SUN_HEART_HEAL.cap * dt);
      healFromKills(m, r);
    }
    m.wait -= dt;
    if (m.wait > 0 || hero.state === "dead") return;
    m.wait = s.cooldown;
    m.since = 0;
    burn(s.damage, r, evolved);
    lights.add(hero.x, hero.y - 6, r * 1.4, evolved ? FIRE_RAMP[2] : FIRE_RAMP[4], evolved ? 0.35 : 0.22, FLARE);
  },
  drawBack(memory, level, evolved) {
    drawRing(memory as AuraMemory, radiusOf(level, evolved), evolved, -1);
  },
  draw(memory, level, evolved) {
    drawRing(memory as AuraMemory, radiusOf(level, evolved), evolved, 1);
  },
};

/** the far half of the ring behind everyone (half -1), the near half in front (half 1) */
function drawRing(m: AuraMemory, r: number, evolved: boolean, half: number): void {
  if (hero.state === "dead") return;
  place();
  const x = hero.x;
  const y = hero.y;
  const ry = r * AURA_REACH.floor;
  const flare = Math.max(0, 1 - m.since / FLARE);
  const t = game.t;
  // the heat on the floor: a dim, broken ring that brightens on each burn
  heat(x, y, r, ry, t, half, evolved ? FIRE_RAMP[4] : FIRE_RAMP[5], (evolved ? 0.55 : 0.45) + flare * 0.5);
  if (flare > 0) heat(x, y, r + 1.5 * (1 - flare), ry + 0.5, -t, half, FIRE_RAMP[evolved ? 2 : 4], flare * 0.8);
  if (evolved) heat(x, y, r * 0.55, ry * 0.55, t * 1.7, half, FIRE_RAMP[5], 0.35 + flare * 0.3);
  // embers ride the ring and rise off it, cooling as they climb
  const count = Math.round((evolved ? 22 : 12) + r * 0.25);
  const rise = evolved ? 16 : 10;
  for (let i = 0; i < count; i++) {
    const seed = i * 2.399;
    const a = seed + t * (evolved ? 0.9 : 0.6) * (i % 2 ? 1 : -1);
    const side = Math.sin(a) < 0 ? -1 : 1;
    if (side !== half) continue;
    const u = (t * (0.7 + (i % 5) * 0.12) + seed) % 1;
    const ex = x + Math.cos(a) * r + Math.sin(t * 3 + seed) * 1.5;
    const ey = y + Math.sin(a) * ry - u * rise;
    const ramp = evolved ? FIRE_RAMP : SPARKS.hot;
    const c = ramp[Math.min(ramp.length - 1, Math.floor(u * ramp.length * (evolved ? 0.7 : 1)))];
    if (u > 0.75 && Math.sin(t * 40 + seed) < 0) continue;
    px(ex, ey, c, 1 - u * 0.6);
    if (evolved && u < 0.3) px(ex, ey + 1, scale(c, 0.8), 0.7);
  }
  if (evolved) drawTongues(x, y, r, ry, t, half);
  if (half < 0) return;
  glow(x, y - 3, r * 1.1, evolved ? FIRE_RAMP[3] : FIRE_RAMP[5], (evolved ? 0.16 : 0.09) + flare * 0.08);
  if (evolved && m.healed < 0.4) glow(x, y - 14, 22, PAL.heal[3], 0.3 * (1 - m.healed / 0.4));
}

/** a broken ring of heat on the floor: dashes that crawl around and flicker, never a solid line */
function heat(x: number, y: number, r: number, ry: number, t: number, half: number, c: Color, a: number): void {
  const n = Math.max(12, Math.ceil(TAU * r * 1.3));
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU;
    const s = Math.sin(g);
    if ((s < 0 ? -1 : 1) !== half) continue;
    const dash = Math.sin(g * 9 + t * 4) + Math.sin(g * 4 - t * 2.3) * 0.6;
    if (dash < 0.2) continue;
    px(x + Math.cos(g) * r, y + s * ry, c, a * Math.min(1, dash));
  }
}

/** Sun Heart: short flames lick up from the ring and die back, each on its own beat */
function drawTongues(x: number, y: number, r: number, ry: number, t: number, half: number): void {
  const count = Math.round(8 + r * 0.15);
  for (let i = 0; i < count; i++) {
    const a = (i * TAU) / count + t * 0.4;
    if ((Math.sin(a) < 0 ? -1 : 1) !== half) continue;
    const h = Math.max(0, Math.sin(t * 5 + i * 2.3)) * 5;
    const fx = x + Math.cos(a) * r;
    const fy = y + Math.sin(a) * ry;
    for (let d = 0; d < h; d += 1) px(fx, fy - d, FIRE_RAMP[Math.min(5, 1 + Math.floor((d / 5) * 5))], 1 - d / 6);
  }
}
