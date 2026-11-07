import { KAEL_COLORS as K, PAL, SPARKS } from "../../constants/palette";
import { DAGGER_FLIGHT as F } from "../../constants/relics/daggers";
import { W } from "../../constants/stage";
import { glowLine, hairline, line, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { WHITE } from "../../utils/color";
import { pruneHits, type RelicHit, takeHit } from "../../utils/relicHits";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { game, hero, particles, progress, rng } from "../state";

type Dagger = {
  id: number;
  x: number;
  y: number;
  /** art pixels a second, signed with the direction */
  vx: number;
  /** art pixels flown, for the trail's length */
  flown: number;
  /** foes it may still strike */
  left: number;
};

type DaggerMemory = {
  t: number;
  /** seconds until the next volley, daggers left in this volley and seconds until the next of them */
  cd: number;
  queue: number;
  wait: number;
  /** the facing the volley was thrown in */
  face: number;
  next: number;
  daggers: Dagger[];
  hits: RelicHit[];
};

/** where the nth dagger of a volley flies, above or below the first */
const OFFSETS = [0, -1, 1, -2, 2, -3, 3, -4, 4];
/** off screen by this much, a dagger is gone */
const MARGIN = 12;
const memoryOf = (m: RelicMemory): DaggerMemory => m as DaggerMemory;
const stats = (level: number, evolved: boolean) => relicStats("daggers", level, evolved, buildStats(progress.build));

function throwOne(m: DaggerMemory, level: number, evolved: boolean, dir: number): void {
  const s = stats(level, evolved);
  const n = s.amount - m.queue;
  const y = hero.y - F.lift + OFFSETS[n % OFFSETS.length] * F.spread;
  m.daggers.push({
    id: m.next++,
    x: hero.x + dir * F.ahead,
    y,
    vx: dir * F.speed * s.speed,
    flown: 0,
    left: s.pierce,
  });
}

/** fly, strike every foe crossed this step */
function fly(m: DaggerMemory, d: Dagger, level: number, evolved: boolean, dt: number): boolean {
  const s = stats(level, evolved);
  const ax = d.x;
  d.x += d.vx * dt;
  d.flown += Math.abs(d.vx * dt);
  const lo = Math.min(ax, d.x) - F.reach;
  const hi = Math.max(ax, d.x) + F.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [x0, y0, x1, y1] = enemyBox(e);
    if (x1 < lo || x0 > hi || d.y < y0 - F.reach || d.y > y1 + F.reach) continue;
    if (!takeHit(m.hits, e, d.id, m.t, F.gap)) continue;
    const dir = Math.sign(d.vx);
    dealDamage(e, s.damage, { source: "daggers", fromX: d.x - dir * 8, kx: dir * F.kick });
    for (let k = 0; k < 3; k++)
      particles.spawn(PK.SPARK, d.x, d.y, -dir * rng.range(30, 90), rng.range(-70, 10), rng.range(0.1, 0.2), {
        sparks: evolved ? SPARKS.crystal : SPARKS.hot,
      });
    d.left--;
    if (d.left <= 0) return false;
  }
  return d.x > -MARGIN && d.x < W + MARGIN;
}

/** a flat throwing dagger, point first, with a speed streak behind */
function drawDagger(d: Dagger, evolved: boolean): void {
  const dir = Math.sign(d.vx);
  const { x, y } = d;
  const C = PAL.crystal;
  const streak = Math.min(evolved ? 22 : 12, d.flown);
  hairline(x - dir * (8 + streak), y, x - dir * 8, y, evolved ? C[3] : K.steelLight, (u) => u * 0.7);
  if (evolved) glowLine(x - dir * (6 + streak), y, x, y, 4, C[3], 0.35);
  px(x - dir * 7, y, K.hilt);
  px(x - dir * 6, y - 1, K.trim);
  px(x - dir * 6, y + 1, K.trim);
  px(x - dir * 6, y, K.trimLight);
  line(x - dir * 5, y, x - dir * 1, y, evolved ? K.blade : K.steelLight);
  hairline(x - dir * 5, y - 0.25, x - dir * 1, y - 0.25, evolved ? K.bladeEdge : K.steelGlint);
  px(x, y, evolved ? C[5] : WHITE);
}

/** Warp Daggers: daggers fly straight ahead where the hero faces. Evolved, ahead and behind. Design: docs/growth-design.md */
export const daggers: RelicBehavior = {
  create: (): DaggerMemory => ({ t: 0, cd: 0.3, queue: 0, wait: 0, face: 1, next: 0, daggers: [], hits: [] }),
  update(memory, level, evolved, dt) {
    const m = memoryOf(memory);
    const s = stats(level, evolved);
    m.t += dt;
    m.cd -= dt;
    if (m.cd <= 0 && m.queue <= 0 && game.enemies.some((e) => e.hp > 0)) {
      m.queue = s.amount;
      m.wait = 0;
      m.face = hero.face;
      m.cd = s.cooldown;
      sfx.evade();
    }
    if (m.queue > 0) {
      m.wait -= dt;
      if (m.wait <= 0) {
        throwOne(m, level, evolved, m.face);
        if (evolved) throwOne(m, level, evolved, -m.face);
        m.queue--;
        m.wait = F.spacing;
      }
    }
    m.daggers = m.daggers.filter((d) => fly(m, d, level, evolved, dt));
    pruneHits(m.hits, m.t);
  },
  draw(memory, _level, evolved) {
    const m = memoryOf(memory);
    place();
    for (const d of m.daggers) drawDagger(d, evolved);
  },
};
