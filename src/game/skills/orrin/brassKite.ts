import { SPARKS } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { orrin } from "../../hero/orrin/memory";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";
import { drawKite } from "./kiteSprite";

const ID = "o_kite";
/** kites keep this far inside the stage */
const EDGE = 6;
/** dive and return speeds, how near a dive strikes, how far a kite looks for a foe, and Sky Armada's ring */
const KITE = { dive: 240, back: 150, reach: 6, sight: 150, ring: 30, spin: 1.6, chill: 1.2, fade: 0.3 } as const;

interface Kite {
  x: number;
  y: number;
  /** seconds it stays; Sky Armada's kites never leave */
  life: number;
  /** seconds until its next dive */
  next: number;
  target: Enemy | null;
  /** its place in the string or the ring */
  slot: number;
  /** seconds alive, for the flutter */
  t: number;
  /** one of Sky Armada's four */
  armada: boolean;
}

interface KiteMemory {
  kites: Kite[];
}

const memoryOf = (m: SkillMemory): KiteMemory => m as unknown as KiteMemory;

/** where a kite waits: trailing behind him on its string, or, for Sky Armada, circling him */
function rest(k: Kite, count: number): readonly [number, number] {
  if (k.armada) {
    const a = game.t * KITE.spin + (k.slot * TAU) / Math.max(1, count);
    return [hero.x + Math.cos(a) * KITE.ring, hero.y - 26 + Math.sin(a) * KITE.ring * 0.45];
  }
  // a string that would trail off the stage's edge streams out ahead of him instead
  const behind = hero.x - hero.face * (22 + k.slot * 12);
  const x = behind < EDGE || behind > W - EDGE ? hero.x + hero.face * (22 + k.slot * 12) : behind;
  return [x, hero.y - 54 - (k.slot % 2) * 8];
}

/** a kite takes off from his hand */
function launch(m: KiteMemory, armada: boolean): void {
  const v = skillValues(ID);
  const most = Math.round(withCharms("amount", v.count));
  const life = armada ? Number.POSITIVE_INFINITY : withCharms("duration", v.life);
  if (m.kites.length >= most) {
    // a full string: the oldest kite stays on instead
    const oldest = m.kites.reduce((a, b) => (a.life < b.life ? a : b));
    oldest.life = Math.max(oldest.life, life);
    return;
  }
  const slot = [0, 1, 2, 3].find((i) => !m.kites.some((k) => k.slot === i)) ?? m.kites.length;
  m.kites.push({ x: hero.x, y: hero.y - 22, life, next: 0.4 + slot * 0.25, target: null, slot, t: 0, armada });
  sfx.swing(1.4);
}

/** sends one kite down at a foe, and its pair with it when kites dive in pairs */
function dive(m: KiteMemory, k: Kite, foe: Enemy): void {
  const v = skillValues(ID);
  k.target = foe;
  k.next = v.every;
  if (!v.pairs) return;
  const mate = m.kites.find((o) => o !== k && !o.target && Math.floor(o.slot / 2) === Math.floor(k.slot / 2));
  if (mate) {
    mate.target = foe;
    mate.next = v.every;
  }
}

/** the dive lands */
function strike(k: Kite, e: Enemy): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - k.x) || hero.face;
  dealDamage(e, progress.stats.ad * v.power, { fromX: k.x, kx: dir * 40, ky: 30, source: ID });
  if (v.chill) e.chill = Math.max(e.chill, KITE.chill);
  game.fx.push(createImpact(cx, cy, dir, false, v.chill ? SPARKS.ice : SPARKS.brass));
}

/** false once a kite has flown off and faded */
function fly(m: KiteMemory, k: Kite, dt: number, count: number): boolean {
  k.t += dt;
  k.life -= dt;
  k.next -= dt;
  if (k.target && k.target.hp <= 0) k.target = null;
  if (!k.target && k.next <= 0 && k.life > 0) {
    const foe = nearestFoe(k.x, k.y);
    if (foe && Math.hypot(foe.x - hero.x, foe.y - hero.y) < KITE.sight) dive(m, k, foe);
    else k.next = 0.2;
  }
  const [tx, ty] = k.target ? enemyCenter(k.target) : k.life > 0 ? rest(k, count) : [k.x, k.y - 60];
  const dx = tx - k.x;
  const dy = ty - k.y;
  const d = Math.hypot(dx, dy);
  const step = (k.target ? KITE.dive : KITE.back) * dt;
  if (d > 0.5) {
    k.x += (dx / d) * Math.min(d, step);
    k.y += (dy / d) * Math.min(d, step);
  }
  if (k.target && d < KITE.reach) {
    strike(k, k.target);
    k.target = null;
  }
  return k.life > -KITE.fade;
}

/**
 * Brass Kite: letting go of a swing may launch a brass kite on a string that trails behind him and dives at the nearest
 * foe; levels raise the chance, add a second kite, pair their dives, chill and keep them longer. Sky Armada keeps four
 * kites circling him for good, and every swing kick sends them all down at the foe.
 */
export const brassKite: SkillBehavior = {
  create: () => ({ kites: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    if (state.evolved) while (m.kites.filter((k) => k.armada).length < skillValues(ID).count) launch(m, true);
    const count = m.kites.length;
    m.kites = m.kites.filter((k) => fly(m, k, dt, count));
    orrin.kites = m.kites.filter((k) => k.life > 0).length;
  },
  draw(memory) {
    const m = memoryOf(memory);
    for (const k of m.kites) {
      const fade = k.life > 0 ? Math.min(1, k.t / KITE.fade) : Math.max(0, 1 + k.life / KITE.fade);
      drawKite(k.x, k.y, k.t, !!k.target, k.armada ? null : { x: hero.x, y: hero.y - 22 }, fade);
    }
  },
  on: {
    release(memory, _event, state) {
      if (state.evolved || !rng.chance(skillValues(ID).chance)) return;
      launch(memoryOf(memory), false);
    },
    swingKick(memory, event, state) {
      if (!state.evolved) return;
      const m = memoryOf(memory);
      for (const k of m.kites) if (!k.target) dive(m, k, event.foe);
    },
  },
};
