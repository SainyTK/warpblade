import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added damage of a Keen blow, `window` seconds after a blow lands that a J press is Keen, `guardBreak`,
 *  `wave` attack damage of the crystal wave a Keen blow sends, `streak` added per Keen blow in a row up to `streakCap`,
 *  `cleave` power of the hop cleave a Keen 4th hit becomes */
const LEVELS = levelRows([
  { text: "Keen blows deal +200% damage.", values: { bonus: 2, window: 0.1 } },
  { text: "Keen window 0.10 to 0.14 s.", values: { window: 0.14 } },
  { text: "New: a Keen blow breaks guards.", values: { guardBreak: 1 } },
  { text: "New: a Keen blow sends a crystal wave forward.", values: { wave: 1.5 } },
  { text: "Keen damage +200% to +500%.", values: { bonus: 5 } },
  { text: "New: each Keen blow in a row adds +25% to the next, up to +100%.", values: { streak: 0.25, streakCap: 1 } },
  { text: "New: a Keen 4th hit is a hop cleave that knocks down.", values: { cleave: 3 } },
  { text: "Keen damage +500% to +2000%; the wave hits far harder.", values: { bonus: 20, wave: 10 } },
]);

export const KEEN_EDGE: SkillDef = {
  id: "k_keen",
  name: "Keen Edge",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Press J in the beat after a blow lands: the Keen blow hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "k_phase",
    name: "Peerless Edge",
    text: "Every third Keen blow ends in a gold cross cut, and for 3 seconds every blow is Keen.",
    row: evolvedRow(LEVELS[7], "Every third Keen blow: a gold cross cut, then 3 s of Keen.", {
      cross: 60,
      crossArea: 15,
      crossReach: 50,
      crossEvery: 3,
      free: 3,
    }),
  },
};
