import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { onDrill } from "./drillLevels";

/** values: `tick` attack damage a stack deals every half second, `max` stacks a foe can carry, `time` seconds the brand lasts, `pillar` Sunpillar brands too, `cut` Oath cut brands too, `bonus` extra damage a branded foe takes */
const NATIVE = levelRows([
  { text: "Bashes brand foes with burning light.", values: { tick: 0.08, max: 3, time: 3 } },
  { text: "Brand burns harder.", values: { tick: 0.11 } },
  { text: "New: Sunpillar brands the foes it strikes.", values: { pillar: 1 } },
  { text: "New: up to 5 stacks.", values: { max: 5 } },
  { text: "Brand burns harder still.", values: { tick: 0.16 } },
  { text: "New: Oath cut brands too.", values: { cut: 1 } },
  { text: "New: a branded foe takes 10% more from everything.", values: { bonus: 0.1 } },
  { text: "Brand burns five times as hard as at first; 6 stacks.", values: { tick: 0.4, max: 6 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "The Shield bash brands foes with burning light.", drill: { bash: 1 } },
  { text: "Brand burns harder.", drill: {} },
  { text: "New: Sunpillar brands the foes it strikes.", drill: { pillar: 1 } },
  { text: "New: up to 5 stacks.", drill: {} },
  { text: "Brand burns harder still.", drill: {} },
  { text: "New: Oath cut brands too.", drill: { cut: 1 } },
  { text: "New: a branded foe takes 10% more from everything.", drill: {} },
  { text: "Brand burns five times as hard as at first; 6 stacks.", drill: {} },
]);

export const SUNBRAND: SkillDef = {
  id: "al_brand",
  name: "Sunbrand",
  kind: "dot",
  element: "blaze",
  risk: "timed",
  button: "J",
  text: "The Shield bash brands the foes it strikes with burning light that stacks.",
  levels: LEVELS,
  evolution: {
    partner: "al_breaker",
    name: "Solar Brand",
    text: "A branded foe that falls bursts and brands every foe near it to the full.",
    row: evolvedRow(LEVELS[7], "Fallen branded foes spread it.", { spread: 40 }),
  },
};
