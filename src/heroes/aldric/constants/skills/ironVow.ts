import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `cost` share off a block's stamina, `walk` share of his walk added to the guard walk, `heal` HP a block gives back, `reach` share added to the Guard bash's reach, `bashRate` share off the Guard bash's wait, `regen` stamina a second while the guard is up, `lance` attack damage of a lance of light a block throws back */
const NATIVE = levelRows([
  { text: "Blocks cost 25% less; stamina +10.", values: { cost: 0.25 }, stats: { stamina: 10 } },
  { text: "A quicker guard walk.", values: { walk: 0.1 } },
  { text: "New: each block heals 1 HP.", values: { heal: 1 } },
  { text: "New: the Guard bash reaches 30% farther.", values: { reach: 0.3 } },
  { text: "Blocks cost half; stamina +25.", values: { cost: 0.5 }, stats: { stamina: 25 } },
  { text: "New: the Guard bash comes back 30% sooner.", values: { bashRate: 0.3 } },
  { text: "New: stamina comes back while the guard is up.", values: { regen: 15 } },
  { text: "A guard walk at 70% of your walk; stamina +40.", values: { walk: 0.25 }, stats: { stamina: 40 } },
]);

const LEVELS = onDrill(NATIVE, [
  {
    text: "Each warp arrival infuses the sword with the selected spell for 1 hit.",
    drill: { charge: 1, preparation: 1 },
  },
  { text: "Spells prepare 15% faster.", drill: { preparation: 0.85 } },
  { text: "New: infusions last 1 more hit.", drill: { infusion: 1 } },
  { text: "New: an arrival takes 1 s off a spell being prepared.", drill: { hasten: 1 } },
  { text: "Spells prepare 30% faster; arrivals infuse 2 hits.", drill: { preparation: 0.7, charge: 2 } },
  { text: "New: an arrival bursts with the selected spell.", drill: { burst: 0.6 } },
  { text: "Infusions last 2 more hits.", drill: { infusion: 2 } },
  { text: "Spells prepare 45% faster; the burst 2.5 times as hard.", drill: { preparation: 0.55, burst: 1.5 } },
]);

export const IRON_VOW: SkillDef = {
  id: "al_vow",
  name: "Iron Vow",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "L",
  text: "Each warp arrival pours the selected spell into the sword, and spells prepare faster.",
  levels: LEVELS,
  evolution: {
    partner: "al_retort",
    name: "Iron Fortress",
    text: "Every warp arrival readies the selected spell.",
    row: evolvedRow(LEVELS[7], "Every arrival readies the selected spell.", {
      ...drillValues({ ready: 1 }),
      lance: 1.5,
    }),
  },
};
