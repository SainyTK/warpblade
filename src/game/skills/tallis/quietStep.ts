import { PAL } from "../../../constants/palette";
import { PRINT_COLORS, PRINT_PIXELS } from "../../../constants/tallis/pixels";
import { disc, place } from "../../../engine/frame";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { tallis } from "../../hero/tallis/memory";
import { stampSoft } from "../../hero/tallis/stamp";
import { game, hero } from "../../state";
import { skillValues } from "../query";

const ID = "t_quietStep";
/** a print every this many pixels walked veiled; prints and Phantom Walk's smoke last this long */
const PRINT = { every: 9, life: 3, reach: 5, chill: 1 } as const;
const PHANTOM = { life: 1.5, reach: 8, blind: 1 } as const;

interface Mark {
  x: number;
  y: number;
  left: number;
  smoke: boolean;
}

interface QuietMemory {
  marks: Mark[];
  walked: number;
  lastX: number;
}

const memoryOf = (m: SkillMemory): QuietMemory => m as unknown as QuietMemory;

/**
 * Quiet Step slows the Veil's drain and quickens his veiled walk in his kit; with its levels his veiled footprints chill
 * foes that cross them, and Phantom Walk leaves smoke along them that blinds.
 */
export const quietStepSkill: SkillBehavior = {
  create: () => ({ marks: [], walked: 0, lastX: hero.x }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    const step = Math.abs(hero.x - m.lastX);
    m.lastX = hero.x;
    if (tallis.veil && hero.ground && (v.prints || v.phantom)) {
      m.walked += step;
      if (m.walked >= PRINT.every) {
        m.walked = 0;
        m.marks.push({ x: hero.x, y: hero.y, left: v.phantom ? PHANTOM.life : PRINT.life, smoke: !!v.phantom });
      }
    }
    for (const k of m.marks) k.left -= dt;
    m.marks = m.marks.filter((k) => k.left > 0);
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      for (const k of m.marks) {
        if (Math.abs(e.x - k.x) > (k.smoke ? PHANTOM.reach : PRINT.reach) || Math.abs(e.y - k.y) > 14) continue;
        e.chill = Math.max(e.chill, PRINT.chill);
        if (k.smoke && e.rank === "minion") e.blind = Math.max(e.blind, PHANTOM.blind);
      }
    }
  },
  drawBack(memory) {
    place();
    for (const k of memoryOf(memory).marks) {
      const a = Math.min(1, k.left);
      stampSoft(PRINT_PIXELS, k.x, k.y, PRINT_COLORS, { show: a * 0.8 });
      if (!k.smoke) continue;
      // a thread of smoke climbs off a phantom print, swelling and thinning as it curls
      for (let j = 0; j < 4; j++) {
        const up = 2 + j * 2.4;
        disc(k.x + Math.sin(j * 1.3 + k.left * 3) * 1.6, k.y - up, 1.1 + j * 0.35, PAL.gloam[2], a * (0.5 - j * 0.09));
      }
    }
  },
};
