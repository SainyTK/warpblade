import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "J on a bar's downbeat is a Kick that throws minions up.",
    values: { power: 1, launch: -190, thump: 0, elite: 0, accent: 0, fourFloor: 0 },
  },
  { text: "The Kick throws higher.", values: { launch: -240 } },
  { text: "The Kick thumps a 30 px floor ring.", values: { thump: 30 } },
  { text: "The Kick deals 40% more.", values: { power: 1.4 } },
  { text: "The Kick knocks elites down.", values: { elite: 1 } },
  { text: "A 40 px thump; the Kick deals 80% more.", values: { thump: 40, power: 1.8 } },
  { text: "The Kick is an Accent.", values: { accent: 1 } },
  { text: "The Kick deals 150% more.", values: { power: 2.5 } },
]);

/** Kick Drum. Design: docs/skills/jory.md. Values: power: the Kick's power as a multiple of its own; launch: how fast it throws a minion up (negative is up); thump: pixels of the floor ring it thumps; elite: 1 it knocks elites down; accent: 1 the Kick is an Accent; fourFloor: 1 every on-beat J may Kick, each with its thump (evolution) */
export const KICK_DRUM: SkillDef = {
  id: "j_kickDrum",
  name: "Kick Drum",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "A J pressed on a bar's downbeat is a front Kick that throws minions up.",
  levels: LEVELS,
  evolution: {
    partner: "j_leap",
    name: "Four on the Floor",
    text: "Every on-beat J may Kick, and each Kick thumps a floor ring.",
    row: evolvedRow(LEVELS[7], "Every on-beat J may Kick.", { fourFloor: 1 }),
  },
};
