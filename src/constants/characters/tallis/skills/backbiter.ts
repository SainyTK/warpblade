import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Blows from behind deal 20% more.",
    values: { power: 0.2, refund: 0, slow: 0, twice: 0, bleed: 0, lastBreath: 0 },
  },
  { text: "A kill from behind gives 10 Gloam back.", values: { refund: 10 } },
  { text: "Blows from behind deal 40% more.", values: { power: 0.4 } },
  { text: "Foes struck from behind turn 0.2 s slower.", values: { slow: 0.2 } },
  { text: "Cross from behind strikes twice.", values: { twice: 1 } },
  { text: "Blows from behind deal 70% more.", values: { power: 0.7 } },
  { text: "Heel Kick from behind leaves a bleed.", values: { bleed: 1 } },
  { text: "Blows from behind deal 150% more.", values: { power: 1.5 } },
]);

/** Backbiter. Design: docs/skills/tallis.md. Values: power: share more his knife blows from behind deal; refund: Gloam a kill from behind gives back; slow: seconds more a foe he struck from behind takes to turn; twice: 1 Cross from behind strikes twice; bleed: 1 Heel Kick from behind bleeds; lastBreath: 1 a blow from behind fells a minion or elite under 25% HP, and deals 3x to a mini boss under it (evolution) */
export const BACKBITER: SkillDef = {
  id: "t_backbiter",
  name: "Backbiter",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "His knife blows from behind cut deeper.",
  levels: LEVELS,
  evolution: {
    partner: "t_shroud",
    name: "Last Breath",
    text: "A blow from behind fells a minion or elite under 25% HP outright; a mini boss under it takes 3x.",
    row: evolvedRow(LEVELS[7], "Blows from behind fell weakened foes.", { lastBreath: 1 }),
  },
};
