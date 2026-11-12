import { HAEMORRHAGE } from "../../../constants/brannoc/skills";
import { PAL, SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { drawBloodDrop } from "../../effects/brannoc/bloodDrop";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { repay } from "../../hero/brannoc/debt";
import { isBloodied } from "../../hero/brannoc/fury";
import { game, hero, lights, particles, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { distance2, foesOnScreen } from "../targets";

const ID = "b_hemorrhage";

/** a planted mark: the foe, seconds left on its fuse and the fuse it started with, and the damage it has stored */
interface Mark {
  foe: Enemy;
  left: number;
  fuse: number;
  stored: number;
}

interface HaemorrhageMemory {
  marks: Mark[];
  /** the swing whose first foe has been seen */
  swing: number;
}

const memoryOf = (m: SkillMemory): HaemorrhageMemory => m as unknown as HaemorrhageMemory;

/** minions and elites; mini bosses and bosses once its level says so */
const takesMark = (e: Enemy): boolean => e.hp > 0 && (e.rank === "minion" || !!skillValues(ID).bosses);

function plant(m: HaemorrhageMemory, foe: Enemy, stored: number): void {
  const fuse = skillValues(ID).fuse ?? 2;
  m.marks.push({ foe, left: fuse, fuse, stored });
}

/** the burst's spray of blood where it went off */
function spray(x: number, y: number): void {
  game.fx.push(createImpact(x, y, rng.chance(0.5) ? 1 : -1, true, SPARKS.rage));
  lights.add(x, y, 26, PAL.rage[3], 0.5, 0.2);
  for (let i = 0; i < 12; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(40, 120);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, rng.range(0.25, 0.45), {
      sparks: SPARKS.rage,
    });
  }
}

/** Red Bloom: the burst chains to the nearest foe close by that can take a mark and has none, and marks it */
function bloom(m: HaemorrhageMemory, from: Enemy, x: number, y: number): void {
  const reach = withCharms("area", HAEMORRHAGE.bloom);
  let best: Enemy | null = null;
  let bestD = reach * reach;
  for (const e of foesOnScreen()) {
    if (e === from || !takesMark(e) || m.marks.some((k) => k.foe === e)) continue;
    const d = distance2(e, x, y);
    if (d > bestD) continue;
    best = e;
    bestD = d;
  }
  if (best) plant(m, best, 0);
}

/**
 * The mark bursts: the marked foe takes what it stored times the skill's multiple, the foes round it half with the
 * spread, a burst repays its share, and Red Bloom marks the next foe. A foe that fell before its fuse ran out bursts
 * where it fell, with the spread, the repay and the bloom.
 */
function burst(m: HaemorrhageMemory, mark: Mark): void {
  if (mark.stored <= 0) return;
  const v = skillValues(ID);
  const e = mark.foe;
  const [x, y] = enemyCenter(e);
  const damage = (v.store ?? 1.5) * mark.stored;
  spray(x, y);
  if (e.hp > 0) dealDamage(e, damage, { source: ID });
  if (v.spread) {
    const r = withCharms("area", v.spread);
    for (const other of foesOnScreen())
      if (other !== e && distance2(other, x, y) <= r * r) dealDamage(other, damage / 2, { source: ID });
  }
  if (v.repay) repay(v.repay, e);
  if (v.bloom) bloom(m, e, x, y);
}

/**
 * Haemorrhage: while he is Bloodied the first foe each swing of his reaches takes a mark if it has none; the mark
 * stores what his blows deal that foe until its fuse runs out, then bursts for a multiple of it. With its levels a
 * bigger multiple, a repay, a spread at half, a shorter fuse and bosses too; Red Bloom chains each burst on.
 */
export const haemorrhageSkill: SkillBehavior = {
  create: () => ({ marks: [], swing: -1 }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    const due: Mark[] = [];
    for (const k of m.marks) {
      k.left -= dt;
      if (k.left <= 0 || k.foe.hp <= 0) due.push(k);
    }
    if (!due.length) return;
    m.marks = m.marks.filter((k) => !due.includes(k));
    for (const k of due) burst(m, k);
  },
  draw(memory) {
    place();
    for (const k of memoryOf(memory).marks) {
      const [x0, top, x1] = enemyBox(k.foe);
      drawBloodDrop((x0 + x1) / 2, top - HAEMORRHAGE.dropHigh, 1 - k.left / k.fuse, game.t);
    }
  },
  on: {
    blow(memory, event) {
      if (event.source !== "attacks" && event.source !== "abilities") return;
      const m = memoryOf(memory);
      const held = m.marks.find((k) => k.foe === event.foe);
      if (held) held.stored += event.damage;
      if (m.swing === hero.swing) return;
      m.swing = hero.swing;
      if (!held && isBloodied() && takesMark(event.foe)) plant(m, event.foe, event.damage);
    },
  },
};
