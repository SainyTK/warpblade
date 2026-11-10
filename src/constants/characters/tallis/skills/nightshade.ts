import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "The third blow adds 2 Nightshade, 0.12x a second.",
    values: { stacks: 2, damage: 0.12, max: 6, life: 4, slow: 0, spread: 0, rising: 0, lotus: 0 },
  },
  { text: "It adds 3 stacks.", values: { stacks: 3 } },
  { text: "Poisoned foes are slowed.", values: { slow: 1 } },
  { text: "It spreads when its foe dies.", values: { spread: 1 } },
  { text: "Nightshade deals 0.2x.", values: { damage: 0.2 } },
  { text: "Rising Cut adds stacks.", values: { rising: 1 } },
  { text: "Nightshade deals 0.27x.", values: { damage: 0.27 } },
  { text: "Nightshade deals 0.35x.", values: { damage: 0.35 } },
]);

/** Nightshade. Design: docs/skills/tallis.md. Values: stacks: stacks the third blow adds; damage: ability power a stack deals a second; max: most stacks; life: seconds; slow: 1 poisoned foes are slowed; spread: 1 a poisoned foe that dies passes it on; rising: 1 Rising Cut adds stacks; lotus: 1 Hamstring coats every foe within 40 px with full stacks (evolution) */
export const NIGHTSHADE: SkillDef = {
  id: "t_nightshade",
  name: "Nightshade",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "The last blow of either string poisons with Nightshade.",
  levels: LEVELS,
  evolution: {
    partner: "t_cutTendon",
    name: "Black Lotus",
    text: "Hamstring coats every foe within 40 px with full Nightshade.",
    row: evolvedRow(LEVELS[7], "Hamstring coats near foes in full.", { lotus: 1 }),
  },
};
