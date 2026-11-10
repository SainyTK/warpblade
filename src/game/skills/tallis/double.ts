import { PAL } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createSlash } from "../../effects/slash";
import { skin } from "../../hero/skin";
import { countBackKill } from "../../hero/tallis/blowSkills";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "t_double";
/** seconds between a shade's stabs */
const STAB_EVERY = 0.14;

interface Shade {
  foe: Enemy | null;
  x: number;
  y: number;
  face: number;
  stabs: number;
  next: number;
  /** seconds it stays after its stabs, finding a new foe */
  linger: number;
  t: number;
}

interface DoubleMemory {
  shades: Shade[];
}

const memoryOf = (m: SkillMemory): DoubleMemory => m as unknown as DoubleMemory;

/** a shade stands behind its foe, on the side the foe does not face */
function standBehind(sh: Shade, e: Enemy): void {
  sh.foe = e;
  sh.face = e.face;
  sh.x = e.x - e.face * 10;
  sh.y = e.y;
}

/** shades appear behind the nearest foes */
function call(m: DoubleMemory): void {
  const v = skillValues(ID);
  const skip: Enemy[] = [];
  for (let i = 0; i < (v.shades || 1); i++) {
    const e = nearestFoe(hero.x, hero.y - 12, skip);
    if (!e) return;
    skip.push(e);
    const sh: Shade = {
      foe: e,
      x: 0,
      y: 0,
      face: 1,
      stabs: Math.round(v.stabs),
      next: 0.08,
      linger: withCharms("duration", v.linger ?? 0),
      t: 0,
    };
    standBehind(sh, e);
    m.shades.push(sh);
  }
}

/** one stab from behind */
function stab(sh: Shade, e: Enemy): void {
  const before = e.hp;
  dealDamage(e, progress.stats.ad * skillValues(ID).power, { fromX: e.x - e.face * 6, source: ID, melee: true });
  if (before > 0 && e.hp <= 0) countBackKill();
  game.fx.push(
    createSlash(sh.x, sh.y, sh.face, {
      cx: 7,
      cy: -15,
      R: 9,
      sy: 0.7,
      rot: 0.2,
      a0: -1.4,
      a1: 0.8,
      W: 2,
      ramp: skin.ramp,
    }),
  );
}

/** false once its stabs and its linger are spent */
function act(sh: Shade, dt: number): boolean {
  sh.t += dt;
  sh.next -= dt;
  if (sh.foe && sh.foe.hp <= 0) sh.foe = null;
  if (!sh.foe && sh.linger > 0) {
    const e = nearestFoe(sh.x, sh.y - 12);
    if (e) {
      standBehind(sh, e);
      sh.stabs = Math.max(sh.stabs, 1);
    }
  }
  if (sh.foe && sh.stabs > 0 && sh.next <= 0) {
    stab(sh, sh.foe);
    sh.stabs--;
    sh.next = STAB_EVERY;
    if (sh.foe.hp > 0) standBehind(sh, sh.foe);
  }
  if (sh.stabs <= 0) sh.linger -= dt;
  return sh.stabs > 0 || sh.linger > 0;
}

/**
 * Shadow Double: a perfect dodge or a rise from the pool may call a shade of him behind the nearest foe that stabs it
 * from behind; with its levels more often, more stabs, lingering for new foes and two shades. Two Moons calls one with
 * every rise.
 */
export const doubleSkill: SkillBehavior = {
  create: () => ({ shades: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.shades = m.shades.filter((sh) => act(sh, dt));
  },
  draw(memory) {
    place();
    for (const sh of memoryOf(memory).shades) {
      const flicker = Math.floor(sh.t * 20) % 3 === 0 ? 0.5 : 0.8;
      const x = Math.round(sh.x);
      const y = Math.round(sh.y);
      for (let j = 2; j < 22; j++) {
        const w = j > 16 ? 2 : j < 6 ? 3 : 2;
        for (let i = -w; i <= w; i++) px(x + i, y - j, PAL.gloam[j > 16 ? 2 : 1], flicker);
      }
      px(x + sh.face, y - 19, PAL.gloam[5]);
      glow(sh.x, sh.y - 12, 10, PAL.gloam[3], 0.15);
    }
  },
  on: {
    perfectDodge(memory) {
      if (rng.chance(skillValues(ID).chance)) call(memoryOf(memory));
    },
    sink(memory) {
      const v = skillValues(ID);
      if (v.twoMoons || rng.chance(v.chance)) call(memoryOf(memory));
    },
  },
};
