import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { STAMINA } from "../../../combat";

const LEVELS = levelRows([
  {
    text: "Your dodge shoulders the foes it passes.",
    values: { power: 0.8, reel: 0.4, flip: 0, ring: 0, ringPower: 0, grit: 0, plate: 0, refund: 0 },
  },
  { text: "Shoulder damage up.", values: { power: 1.3 } },
  { text: "Minions you pass are flipped and slammed behind you.", values: { flip: 1.2 } },
  { text: "Each foe you pass gives Grit.", values: { grit: 8 } },
  { text: "Flips ring out; a harder shoulder.", values: { power: 2, ring: 24, ringPower: 0.8 } },
  { text: "A perfect dodge fills a plate.", values: { plate: 1 } },
  { text: "Dodging through a foe gives half its stamina back.", values: { refund: STAMINA.dashCost / 2 } },
  { text: "The shoulder and the flip hit far harder.", values: { power: 4, flip: 2.5 } },
]);

/** Shoulder Check. Design: docs/skills/hulda.md. Values: power: attack damage each foe the dodge passes takes; reel: seconds it reels; flip: attack damage of the slam on each minion passed, flipped down behind her (0 none); ring: radius of the flip's ring (0 none); ringPower; grit: Grit each foe passed gives; plate: 1 a perfect dodge fills a plate; refund: stamina a dodge through a foe gives back */
export const SHOULDER_CHECK: SkillDef = {
  id: "h_shoulderCheck",
  name: "Shoulder Check",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Your dodge leads with the iron pauldron: foes you pass are shouldered aside, and later flipped down behind you.",
  levels: LEVELS,
  evolution: {
    partner: "h_ironHide",
    name: "Battering Ram",
    text: "Every foe you dodge through is battered and flipped into a wide ring, gives a full plate, and the dodge costs nothing.",
    row: evolvedRow(LEVELS[7], "Flips ring wide; a plate a foe; free dodges.", {
      power: 6,
      flip: 4,
      ring: 40,
      ringPower: 2,
      grit: 25,
      refund: STAMINA.dashCost,
    }),
  },
};
