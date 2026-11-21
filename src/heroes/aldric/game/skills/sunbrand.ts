import { createGlint } from "../../../../game/effects/flash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../game/skills/query";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DAWN_RAMP } from "../../constants/light";
import { BRAND_SPREAD } from "../../constants/skillNumbers";
import { brandSpec } from "../abilities/pillars";
import { foesNear } from "../strike";
import "../../types/events";

const ID = "al_brand";

/** brand a foe: one stack more, up to the most */
export const brand = (e: Enemy | null): void => {
  if (e && e.hp > 0) addStacks(e, ID, brandSpec(skillValues(ID)));
};

/** Sunbrand: bashes brand the foes they strike (and Oath cut from its sixth level); as Solar Brand a branded foe that
 *  falls brands every foe near it to the full */
export const sunbrand: SkillBehavior = {
  create: () => ({}),
  on: {
    bash(_m, ev) {
      brand(ev.foe);
    },
    blow(_m, ev) {
      if (ev.move === "oathCut" && skillValues(ID).cut) brand(ev.foe);
    },
    kill(_m, ev, state) {
      if (!state.evolved || stacksOf(ev.foe, ID) <= 0) return;
      const [x, y] = enemyCenter(ev.foe);
      const spec = brandSpec(skillValues(ID));
      for (const e of foesNear(x, y, BRAND_SPREAD)) addStacks(e, ID, { ...spec, stacks: spec.max });
      game.fx.push(createGlint(x, y, DAWN_RAMP[5], 1));
    },
  },
};
