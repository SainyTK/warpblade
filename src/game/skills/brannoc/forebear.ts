import { FOREBEAR_SPEC } from "../../../constants/brannoc/skills";
import { COMBO } from "../../../constants/combat";
import { PAL, SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { drawForebear } from "../../effects/brannoc/forebear";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { brannoc } from "../../hero/brannoc/memory";
import { game, hero, lights, progress } from "../../state";
import { boxHit } from "../../world";
import { skillValues, withCharms } from "../query";

const ID = "b_ancestor";
/** seconds between one forebear's swing and the next one's when several swing together */
const STAGGER_SWINGS = 0.06;

interface Bear {
  x: number;
  y: number;
  slot: number;
  face: number;
  /** seconds since it came, since it began to fade, until its called swing, and into the swing under way (-1 none) */
  t: number;
  gone: number;
  pending: number;
  swing: number;
}

interface ForebearMemory {
  bears: Bear[];
  /** his blows counted while a forebear stands, the swing last counted, and seconds it stays after Frenzy ends */
  blows: number;
  swing: number;
  outlast: number;
}

const memoryOf = (m: SkillMemory): ForebearMemory => m as unknown as ForebearMemory;

/** where a forebear stands: behind him, each next one a step further back */
const placeOf = (slot: number): number => -(FOREBEAR_SPEC.behind + FOREBEAR_SPEC.apart * slot);

/** forebears wanted now: the host through Berserk, one through Frenzy and its outlast, none otherwise */
function wanted(m: ForebearMemory): number {
  const host = skillValues(ID).host ?? 0;
  if (host && brannoc.berserkT > 0) return host;
  return brannoc.frenzyT > 0 || m.outlast > 0 ? 1 : 0;
}

const standing = (b: Bear): boolean => b.gone <= 0;

/** forebears come to fill the places wanted, and the ones past them fade */
function muster(m: ForebearMemory): void {
  const n = wanted(m);
  for (const b of m.bears) if (b.slot >= n && standing(b)) b.gone = 1e-6;
  for (let slot = 0; slot < n; slot++) {
    if (m.bears.some((b) => b.slot === slot && standing(b))) continue;
    m.bears.push({
      x: hero.x + placeOf(slot) * hero.face,
      y: hero.y,
      slot,
      face: hero.face,
      t: 0,
      gone: 0,
      pending: -1,
      swing: -1,
    });
  }
}

/** one forebear's swing: every foe in front of him, and behind him too with its level */
function strike(b: Bear): void {
  const v = skillValues(ID);
  const reach = withCharms("area", FOREBEAR_SPEC.reach);
  const sides = v.both ? [hero.face, -hero.face] : [hero.face];
  b.swing = 0;
  b.face = hero.face;
  lights.add(hero.x + hero.face * reach * 0.5, hero.y - 16, 30, PAL.rage[3], 0.3, 0.15);
  for (const dir of sides) {
    const near = hero.x;
    const far = hero.x + dir * reach;
    const box: [number, number, number, number] = [
      Math.min(near, far),
      hero.y - FOREBEAR_SPEC.height,
      Math.max(near, far),
      hero.y,
    ];
    for (const e of game.enemies) {
      if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
      const result = dealDamage(e, progress.stats.ad * (v.power ?? 0), {
        fromX: hero.x,
        kx: dir * FOREBEAR_SPEC.knock,
        stagger: v.stagger ? COMBO.stagger : undefined,
        source: ID,
      });
      if (result === "blocked") continue;
      const [cx, cy] = enemyCenter(e);
      game.fx.push(createImpact(cx, cy, dir, false, SPARKS.rage));
      if (v.stagger && e.hp > 0 && e.rank === "minion")
        markFoe(e, ID, FOREBEAR_SPEC.mark.seconds, FOREBEAR_SPEC.mark.bonus);
    }
  }
}

/** it keeps its place behind him, swings when called, and is gone once faded */
function stand(b: Bear, dt: number): boolean {
  b.t += dt;
  if (b.gone > 0) b.gone += dt;
  if (b.pending >= 0) {
    b.pending -= dt;
    if (b.pending < 0 && standing(b)) strike(b);
  }
  if (b.swing >= 0) {
    b.swing += dt / FOREBEAR_SPEC.swing;
    if (b.swing >= 1) b.swing = -1;
  } else b.face = hero.face;
  const k = Math.min(1, dt * FOREBEAR_SPEC.follow);
  b.x += (hero.x + placeOf(b.slot) * hero.face - b.x) * k;
  if (hero.ground) b.y += (hero.y - b.y) * k;
  return b.gone < FOREBEAR_SPEC.fade;
}

/**
 * Forebear: Frenzy calls a ghostly forebear who stands behind him through it and swings its great axe on every few of
 * his blows; with its levels harder, more often, both sides, staggering and marking minions, and staying a while after
 * Frenzy. Host of Forebears keeps three with him through Berserk.
 */
export const forebearSkill: SkillBehavior = {
  create: () => ({ bears: [], blows: 0, swing: -1, outlast: 0 }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    m.outlast = Math.max(0, m.outlast - dt);
    muster(m);
    m.bears = m.bears.filter((b) => stand(b, dt));
  },
  draw(memory) {
    place();
    for (const b of memoryOf(memory).bears) {
      const show = Math.min(1, b.t / FOREBEAR_SPEC.show) * (1 - b.gone / FOREBEAR_SPEC.fade);
      drawForebear(b.x, b.y, b.face, b.swing, show * 0.85);
    }
  },
  on: {
    frenzy(memory, event) {
      const m = memoryOf(memory);
      m.outlast = event.on ? 0 : withCharms("duration", skillValues(ID).outlast ?? 0);
    },
    blow(memory, event) {
      if (event.source !== "attacks") return;
      const m = memoryOf(memory);
      if (m.swing === hero.swing) return;
      m.swing = hero.swing;
      const bears = m.bears.filter(standing);
      if (!bears.length) return;
      m.blows++;
      if (m.blows % Math.max(1, skillValues(ID).every ?? 3)) return;
      for (const b of bears) b.pending = b.slot * STAGGER_SWINGS;
    },
  },
};
