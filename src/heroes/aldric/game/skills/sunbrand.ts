import { nativeOrDrill } from "../../../../drill";
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
import { surfaceBelow } from "../../../../game/world";
import { aldricFx } from "../fx";

const ID = "al_brand";

/** brand a foe: one stack more, up to the most */
export const brand = (e: Enemy | null): void => {
  if (!e || e.hp <= 0) return;
  const spec = brandSpec(skillValues(ID));
  addStacks(e, ID, spec);
  const [x, y] = enemyCenter(e);
  const stacks = stacksOf(e, ID);
  aldricFx(ID, "burst", { x, y, reach: 8 + stacks * 2 }, { damage: spec.damage * 6 * stacks, sigil: "sun", lift: 2 });
};

/** Solar Brand: a branded foe that falls brands every foe near it to the full */
function spreadBrand(foe: Enemy): void {
  if (stacksOf(foe, ID) <= 0) return;
  const [x, y] = enemyCenter(foe);
  const spec = brandSpec(skillValues(ID));
  for (const e of foesNear(x, y, BRAND_SPREAD)) addStacks(e, ID, { ...spec, stacks: spec.max });
  aldricFx(
    ID,
    "nova",
    { x, y: surfaceBelow(x, y), reach: BRAND_SPREAD },
    { damage: spec.damage * 6 * spec.max, sigil: "sun", lift: 18 },
  );
  game.fx.push(createGlint(x, y, DAWN_RAMP[5], 1));
}

/** Sunbrand: bashes brand the foes they strike (and Oath cut from its sixth level); as Solar Brand a branded foe that
 *  falls brands every foe near it to the full. On the drill the Shield bash and Oath cut brand through the drill hooks */
export const sunbrand: SkillBehavior = nativeOrDrill(
  {
    create: () => ({}),
    on: {
      bash(_m, ev) {
        brand(ev.foe);
      },
      blow(_m, ev) {
        if (ev.move === "oathCut" && skillValues(ID).cut) brand(ev.foe);
      },
      kill(_m, ev, state) {
        if (state.evolved) spreadBrand(ev.foe);
      },
    },
  },
  {
    create: () => ({}),
    on: {
      kill(_m, ev, state) {
        if (state.evolved) spreadBrand(ev.foe);
      },
    },
  },
);
