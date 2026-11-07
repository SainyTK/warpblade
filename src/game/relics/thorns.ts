import { BRAMBLE_PATCH, THORN_COLORS, THORN_GROWTH } from "../../constants/relics/thorns";
import { GROUND } from "../../constants/stage";
import { fleck, glow, line, place, polygon, px } from "../../engine/frame";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Ramp } from "../../types/color";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { clamp, ease } from "../../utils/math";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { game, hero, particles, progress, rng } from "../state";

/** one thorn standing on the floor */
interface Thorn {
  x: number;
  /** seconds since it sprouted, and how long it stands */
  t: number;
  life: number;
  /** its size, the area when it sprouted */
  size: number;
  seed: number;
}

interface ThornMemory extends RelicMemory {
  /** floor covered since the last thorn */
  travel: number;
  lastX: number;
  /** on the floor last step, to catch landings */
  floored: boolean;
  thorns: Thorn[];
  /** Bramble Wake's patch growth: 0 is its starting size */
  growth: number;
  /** when each foe was last hurt, by game time */
  hurtAt: WeakMap<Enemy, number>;
}

/** the most thorns one hero keeps; the oldest go first */
const MOST_THORNS = 60;

const onFloor = (): boolean => hero.ground && hero.y >= GROUND - 0.5 && hero.state !== "dead";

function sprout(m: ThornMemory, x: number, size: number, life: number): void {
  m.thorns.push({ x, t: 0, life, size, seed: rng.range(0, 100) });
  if (m.thorns.length > MOST_THORNS) m.thorns.shift();
}

/** a thorn's height now: it pushes up, stands, then sinks back */
function heightOf(o: Thorn): number {
  const up = ease.outBack(clamp(o.t / THORN_GROWTH.sprout));
  const down = clamp((o.life - o.t) / THORN_GROWTH.wither);
  return THORN_GROWTH.height * o.size * up * down;
}

const patchHalf = (m: ThornMemory, area: number): number => BRAMBLE_PATCH.halfWidth * area * (1 + m.growth);

/** a foe low enough to touch the floor across [x0, x1], hurt once per cooldown by all of this hero's thorns together */
function hurt(m: ThornMemory, e: Enemy, damage: number, cooldown: number, x: number, R: Ramp): void {
  if (game.t - (m.hurtAt.get(e) ?? Number.NEGATIVE_INFINITY) < cooldown) return;
  m.hurtAt.set(e, game.t);
  dealDamage(e, damage, { source: "thorns", fromX: x });
  particles.spawn(PK.SHARD, e.x, GROUND - 2, rng.range(-40, 40), -rng.range(60, 110), 0.5, {
    col: R[3],
    size: 2,
  });
}

function hurtFoes(m: ThornMemory, damage: number, cooldown: number, evolved: boolean, area: number): void {
  const half = THORN_GROWTH.halfWidth;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const box = enemyBox(e);
    if (evolved && box[3] >= GROUND - THORN_GROWTH.height * area * 1.4) {
      const ph = patchHalf(m, area);
      if (box[0] < hero.x + ph && box[2] > hero.x - ph) {
        hurt(m, e, damage, cooldown, hero.x, THORN_COLORS.bramble);
        continue;
      }
    }
    for (const o of m.thorns) {
      const h = heightOf(o);
      if (h < 2 || box[3] < GROUND - h || box[0] >= o.x + half * o.size || box[2] <= o.x - half * o.size) continue;
      hurt(m, e, damage, cooldown, o.x, evolved ? THORN_COLORS.bramble : THORN_COLORS.trail);
      break;
    }
  }
}

/** Thorn Trail: moving on the floor leaves thorns that hurt walkers in them; Bramble Wake keeps a growing patch underfoot */
export const thorns: RelicBehavior = {
  create: (): ThornMemory => ({
    travel: 0,
    lastX: hero.x,
    floored: true,
    thorns: [],
    growth: 0,
    hurtAt: new WeakMap(),
  }),
  update(memory, level, evolved, dt) {
    const m = memory as ThornMemory;
    const s = relicStats("thorns", level, evolved, buildStats(progress.build));
    const floored = onFloor();
    const moved = floored ? Math.abs(hero.x - m.lastX) : 0;
    m.lastX = hero.x;
    if (floored && !m.floored)
      for (let i = 0; i < THORN_GROWTH.landing + s.amount - 1; i++)
        sprout(m, hero.x + rng.range(-2, 2) * THORN_GROWTH.halfWidth * s.area, s.area, s.duration);
    m.floored = floored;
    m.travel += moved;
    const stretch = THORN_GROWTH.stretch / s.amount;
    while (m.travel >= stretch) {
      m.travel -= stretch;
      sprout(m, hero.x + rng.range(-2, 2), s.area, s.duration);
    }
    if (evolved) {
      const most = BRAMBLE_PATCH.most - 1;
      m.growth = Math.min(most, m.growth + moved * BRAMBLE_PATCH.growPerPixel);
      if (moved === 0) m.growth = Math.max(0, m.growth - m.growth * BRAMBLE_PATCH.shrink * dt);
    }
    for (const o of m.thorns) o.t += dt;
    m.thorns = m.thorns.filter((o) => o.t < o.life);
    hurtFoes(m, s.damage, s.cooldown, evolved && hero.state !== "dead", s.area);
  },
  drawBack(memory, level, evolved) {
    const m = memory as ThornMemory;
    const area = relicStats("thorns", level, evolved, buildStats(progress.build)).area;
    const R = evolved ? THORN_COLORS.bramble : THORN_COLORS.trail;
    place();
    for (const o of m.thorns) drawThorn(o.x, heightOf(o), o.size, o.seed, R);
    if (evolved && hero.state !== "dead") drawPatch(hero.x, patchHalf(m, area), area);
  },
};

/** a clump of hard spikes from one root: a tall one in the middle and two shorter leaning out, each a dark wedge with a
 *  lit edge and a pale point */
function drawThorn(x: number, h: number, size: number, seed: number, R: Ramp): void {
  if (h < 1.5) return;
  const lean = ((seed % 1) - 0.5) * 2;
  const tall = 0.8 + ((seed * 7) % 1) * 0.3;
  const spikes: readonly [number, number, number][] = [
    [-2.5 * size, 0.55, -1.5 * size],
    [2.5 * size, 0.65, 1.5 * size],
    [0, tall, lean],
  ];
  for (const [dx, k, tilt] of spikes) {
    const bx = x + dx;
    const top = GROUND - h * k;
    const w = 1.1 * size;
    polygon(
      [
        [bx - w, GROUND + 0.5],
        [bx + w, GROUND + 0.5],
        [bx + tilt, top],
      ],
      R[1],
    );
    line(bx + w * 0.4, GROUND - 1, bx + tilt, top + 1, R[2]);
    fleck(bx + tilt, top, R[4]);
    px(bx + tilt * 0.9, top + 1, R[3]);
  }
}

/** Bramble Wake's patch: a low mat of briars under the hero, its thorns rising and falling on a slow wave, tips lit */
function drawPatch(x: number, half: number, area: number): void {
  const R = THORN_COLORS.bramble;
  const t = game.t;
  for (let dx = -half; dx <= half; dx += 1) {
    const edge = 1 - Math.abs(dx) / half;
    px(x + dx, GROUND, R[dx % 3 === 0 ? 2 : 1]);
    if (edge > 0.1 && Math.round(dx) % 2 === 0) px(x + dx, GROUND - 1, R[1], edge);
  }
  const step = 5;
  const first = Math.ceil((x - half) / step) * step;
  for (let sx = first; sx <= x + half; sx += step) {
    const edge = 1 - Math.abs(sx - x) / half;
    const h = THORN_GROWTH.height * area * (0.5 + 0.5 * edge) * (0.75 + 0.25 * Math.sin(t * 6 + sx * 0.7));
    drawThorn(sx, h, area * 0.8, sx * 0.37, R);
    glow(sx, GROUND - h, 5, R[3], 0.2 * edge);
  }
}
