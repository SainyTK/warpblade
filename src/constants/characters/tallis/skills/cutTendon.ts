import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "Hamstring deals 25% more.", values: { power: 0.25, tripBack: 0, foes: 1, bleed: 0, stun: 0, wave: 0 } },
  { text: "Tripped foes take 20% more from behind.", values: { tripBack: 0.2 } },
  { text: "Hamstring deals 40% more.", values: { power: 0.4 } },
  { text: "Hamstring trips two foes.", values: { foes: 2 } },
  { text: "Hamstring leaves a bleed.", values: { bleed: 1 } },
  { text: "Foes stay tripped 0.3 s longer.", values: { stun: 0.3 } },
  { text: "Hamstring deals 60% more.", values: { power: 0.6 } },
  { text: "Hamstring deals 100% more.", values: { power: 1 } },
]);

/** Cut Tendon. Design: docs/skills/tallis.md. Values: power: share more Hamstring deals; tripBack: share more a tripped foe takes from his blows from behind; foes: foes one Hamstring trips; bleed: 1 Hamstring bleeds; stun: seconds more it trips; wave: 1 Hamstring runs along the floor as a 90 px wave (evolution) */
export const CUT_TENDON: SkillDef = {
  id: "t_cutTendon",
  name: "Cut Tendon",
  kind: "attack",
  risk: "timed",
  button: "I",
  text: "Hamstring cuts deeper and leaves the foes it trips open.",
  levels: LEVELS,
  evolution: {
    partner: "t_openVeins",
    name: "Crippling Line",
    text: "Hamstring runs along the floor as a 90 px wave that trips every foe on it.",
    row: evolvedRow(LEVELS[7], "Hamstring runs along the floor as a wave.", { wave: 1, foes: 9 }),
  },
};
