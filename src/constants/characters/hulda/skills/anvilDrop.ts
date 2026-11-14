import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Your jump lands with a shock round you.",
    values: { power: 0.6, radius: 24, reel: 0.4, rise: 1, launch: 0, hop: 0, fliers: 0, grit: 0 },
  },
  { text: "Landing damage up.", values: { power: 1 } },
  { text: "You jump higher.", values: { rise: 1.25 } },
  { text: "The landing throws minions up.", values: { launch: 1 } },
  { text: "A wider, harder landing.", values: { power: 1.6, radius: 40 } },
  { text: "Jump once more in the air.", values: { hop: 1 } },
  { text: "The landing shakes fliers down.", values: { fliers: 1 } },
  { text: "The landing hits far harder.", values: { power: 3, radius: 48 } },
]);

/** Anvil Drop. Design: docs/skills/hulda.md. Values: power: attack damage of the landing's shock; radius: pixels it reaches each way along the floor; reel: seconds foes it strikes reel; rise: her jump's height multiple; launch: 1 throws minions up; hop: 1 Up in the air hops once more; fliers: 1 shakes fliers near the landing down; grit: Grit a landing that strikes gives (evolution) */
export const ANVIL_DROP: SkillDef = {
  id: "h_anvilDrop",
  name: "Anvil Drop",
  kind: "movement",
  risk: "easy",
  button: "jump",
  text: "You land from a jump like an anvil: a shock runs out round your feet.",
  levels: LEVELS,
  evolution: {
    partner: "h_tremorStomp",
    name: "Mountain Fall",
    text: "Every landing shakes the floor far round you and hits far harder, and a landing that strikes fills a plate.",
    row: evolvedRow(LEVELS[7], "A far wider landing that fills a plate.", { power: 4.5, radius: 72, grit: 25 }),
  },
};
