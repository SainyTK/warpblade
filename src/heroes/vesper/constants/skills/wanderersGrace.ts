import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `pdTempo` Tempo a perfect dodge adds, `heal` HP a parry or perfect dodge gives, `guard` share less damage taken
 *  while Tempo is above half; evolved, the ward */
const LEVELS = levelRows([
  { text: "+10 HP.", stats: { hp: 10 } },
  { text: "New: a perfect dodge adds 3 Tempo.", values: { pdTempo: 3 } },
  { text: "+20 HP; you move 10% faster.", stats: { hp: 20, move: 0.1 } },
  { text: "New: a parry or perfect dodge heals 4 HP.", values: { heal: 4 } },
  { text: "+30 HP; +20 stamina.", stats: { hp: 30, move: 0.1, stamina: 20 } },
  { text: "New: above half Tempo foes deal you 10% less.", values: { guard: 0.1 } },
  { text: "The heal 4 to 8.", values: { heal: 8 } },
  {
    text: "+45 HP; foes deal 15% less above half Tempo.",
    stats: { hp: 45, move: 0.1, stamina: 20 },
    values: { guard: 0.15 },
  },
]);

export const WANDERERS_GRACE: SkillDef = {
  id: "ve_grace",
  name: "Wanderer's Grace",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "More HP and speed, and good timing keeps you whole.",
  levels: LEVELS,
  evolution: {
    partner: "ve_twin",
    name: "Dusk Ward",
    text: "At the top of Tempo the first blow in every 4 s is turned aside by itself.",
    row: evolvedRow(LEVELS[7], "At the top of Tempo a blow every 4 s is turned aside.", {}),
  },
};
