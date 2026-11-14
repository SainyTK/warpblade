import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `parry` HP a parry heals, `link` HP a riposte link heals, `mp` MP a Keen blow gives, `chip` less of a blocked
 *  blow through and `cost` less stamina a block costs, `dodge` HP a perfect dodge heals; evolved `parryMp` MP a parry
 *  gives */
const LEVELS = levelRows([
  { text: "A parry heals 4 HP.", values: { parry: 4 } },
  { text: "New: each riposte link heals 1 HP.", values: { link: 1 } },
  { text: "Parry heals 4 to 8 HP.", values: { parry: 8 } },
  { text: "New: a Keen blow gives 2 MP.", values: { mp: 2 } },
  { text: "New: blocks let 15% less through and cost 6 less stamina.", values: { chip: 0.15, cost: 6 } },
  { text: "Parry heals 8 to 12 HP.", values: { parry: 12 } },
  { text: "New: a perfect dodge heals 6 HP.", values: { dodge: 6 } },
  { text: "Parry heals 12 to 20 HP; links heal 3.", values: { parry: 20, link: 3 } },
]);

export const GRACE: SkillDef = {
  id: "ce_grace",
  name: "Grace",
  kind: "passive",
  risk: "timed",
  button: "K",
  text: "Parries and ripostes heal you, and your block grows firmer.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Rose Grace",
    text: "A parry also gives 20 MP.",
    row: evolvedRow(LEVELS[7], "A parry also gives 20 MP.", { parryMp: 20 }),
  },
};
