import { stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { WOUND, WOUND_SOURCE } from "../../constants/wounds";
import { ringTier } from "../whirl";
import { openWounds } from "../wounds";

const ID = "za_deep";
/** how far a dying foe's wounds reach */
const SPREAD_REACH = 34;

/** Deep Wounds: his wounds read its numbers where they are opened (game/wounds.ts); here a foe that dies bleeding opens
 *  half its wounds on the foes beside it, and as Crimson Tide no wound closes while the sand ring turns */
export const deepWounds: SkillBehavior = {
  create: () => ({}),
  update(_memory, state) {
    if (!state.evolved || !ringTier()) return;
    const life = withCharms("duration", skillValues(ID).life ?? WOUND.life);
    for (const e of foesOnScreen()) {
      const entry = e.stacks.find((s) => s.source === WOUND_SOURCE);
      if (entry) entry.left = Math.max(entry.left, life);
    }
  },
  on: {
    kill(_memory, ev) {
      if (!skillValues(ID).spread) return;
      const n = Math.ceil(stacksOf(ev.foe, WOUND_SOURCE) / 2);
      if (!n) return;
      for (const f of foesOnScreen()) if (f !== ev.foe && Math.abs(f.x - ev.foe.x) <= SPREAD_REACH) openWounds(f, n);
    },
  },
};
