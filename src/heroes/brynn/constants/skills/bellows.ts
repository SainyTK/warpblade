import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `heftGain` Heft comes this much faster, `hold` added seconds before Heft drains, `speed` at full Heft her
 *  swings are this much faster, `stamina` at full Heft stamina comes back this many a second, `damage` at full Heft her
 *  hits deal this much more */
const LEVELS = levelRows([
  { text: "Heft builds 20% faster.", values: { heftGain: 0.2 } },
  { text: "New: Heft waits 2 s longer before it drains.", values: { hold: 2 } },
  { text: "New: at full Heft her swings are 15% faster.", values: { speed: 0.15 } },
  { text: "Heft builds 20% to 40% faster.", values: { heftGain: 0.4 } },
  { text: "New: at full Heft stamina comes back 20 a second.", values: { stamina: 20 } },
  { text: "Swings at full Heft 15% to 25% faster.", values: { speed: 0.25 } },
  { text: "New: at full Heft her hits deal +20%.", values: { damage: 0.2 } },
  { text: "Heft builds 40% to 80% faster; full Heft hits +35%.", values: { heftGain: 0.8, damage: 0.35 } },
]);

export const BELLOWS: SkillDef = {
  id: "br_bellows",
  name: "Bellows",
  kind: "passive",
  risk: "timed",
  button: "auto",
  text: "Heft builds faster and holds longer, and a full bar makes her swing faster.",
  levels: LEVELS,
  evolution: {
    partner: "br_crush",
    name: "Furnace",
    text: "A fissure leaves half the bar full.",
    row: evolvedRow(LEVELS[7], "A fissure leaves half the bar full.", { keep: 0.5 }),
  },
};
