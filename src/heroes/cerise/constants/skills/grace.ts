import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `parry` HP a parry heals, `link` HP a riposte link heals, `mp` MP a Keen blow gives, `chip` less of a blocked
 *  blow through and `cost` less stamina a block costs, `dodge` HP a perfect dodge heals; evolved `parryMp` MP a parry
 *  gives */
const NATIVE = levelRows([
  { text: "A parry heals 4 HP.", values: { parry: 4 } },
  { text: "New: each riposte link heals 1 HP.", values: { link: 1 } },
  { text: "Parry heals 4 to 8 HP.", values: { parry: 8 } },
  { text: "New: a Keen blow gives 2 MP.", values: { mp: 2 } },
  { text: "New: blocks let 15% less through and cost 6 less stamina.", values: { chip: 0.15, cost: 6 } },
  { text: "Parry heals 8 to 12 HP.", values: { parry: 12 } },
  { text: "New: a perfect dodge heals 6 HP.", values: { dodge: 6 } },
  { text: "Parry heals 12 to 20 HP; links heal 3.", values: { parry: 20, link: 3 } },
]);

const LEVELS = withDrill(NATIVE, [
  {
    text: "The warp's arrival infuses the rapier with the selected spell for 1 hit.",
    drill: { infuse: 1, preparation: 0, hits: 0 },
  },
  { text: "Spell preparation 15% faster.", drill: { preparation: 0.15 } },
  { text: "New: the arrival heals 3 HP.", drill: { heal: 3 } },
  { text: "Infusions last 1 more hit.", drill: { hits: 1 } },
  { text: "New: the arrival shortens a preparation by 1 s.", drill: { hasten: 1 } },
  { text: "Preparation 30% faster; the arrival heals 6 HP.", drill: { preparation: 0.3, heal: 6 } },
  { text: "New: infused hits heal 1 HP.", drill: { infusedHeal: 1 } },
  {
    text: "Preparation 45% faster; infusions last 2 more hits; arrival infusion 2 hits.",
    drill: { preparation: 0.45, hits: 2, infuse: 2 },
  },
]);

export const GRACE: SkillDef = {
  id: "ce_grace",
  name: "Grace",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The warp's arrival pours the selected spell into the rapier and heals you.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Rose Grace",
    text: "Every arrival readies the selected spell at once.",
    row: evolvedRow(LEVELS[7], "Every arrival readies the selected spell.", {
      ...drillValues({ ready: 1 }),
      parryMp: 20,
    }),
  },
};
