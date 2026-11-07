import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { pinFoe } from "../../hero/ysra/pin";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { progress } from "../../state";
import { skillValues } from "../query";
import { foesWithin } from "./memory";

const ID = "y_impale";
/** a fallen pinned foe's burst reaches this far, and pins the foes it reaches this long */
const BURST_RADIUS = 24;
const BURST_PIN = 1;

/** Impale: a pinned foe that falls bursts, striking and pinning the foes beside it; a foe its own burst felled does
 *  not burst again, so bursts never chain */
export const impale: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_memory, { foe, source }) {
      const v = skillValues(ID);
      if (!v.burst || foe.pinned <= 0 || source === ID) return;
      const [x, y] = enemyCenter(foe);
      const near = foesWithin(x, y, BURST_RADIUS, foe);
      burstEmbers(x, y, progress.stats.ad * v.burst, BURST_RADIUS, 1, ID);
      for (const e of near) pinFoe(e, { time: BURST_PIN, taken: v.taken, burn: 0 });
    },
  },
};
