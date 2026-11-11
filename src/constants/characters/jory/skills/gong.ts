import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "18 MP: a gong rings on the next 4 beats, 50 px, 0.5x.",
    values: { mp: 18, cooldown: 8, beats: 4, radius: 50, power: 0.5, pull: 0, stagger: 0, second: 0, temple: 0 },
  },
  { text: "It rings 6 beats.", values: { beats: 6 } },
  { text: "65 px rings.", values: { radius: 65 } },
  { text: "Each ring pulls foes 10 px in.", values: { pull: 10 } },
  { text: "Rings stagger minions.", values: { stagger: 1 } },
  { text: "Rings deal 0.8x.", values: { power: 0.8 } },
  { text: "A second gong rings behind him.", values: { second: 1 } },
  { text: "1.2x; 8 beats.", values: { power: 1.2, beats: 8 } },
]);

/** Gong. Design: docs/skills/jory.md. Values: mp: MP; cooldown: seconds; beats: rings; radius: pixels each ring reaches; power: ability power each ring deals; pull: pixels each ring pulls foes in; stagger: 1 rings stagger minions; second: 1 a second gong rings behind him; temple: 1 rings burst Resonance stacks (evolution) */
export const GONG: SkillDef = {
  id: "j_gong",
  name: "Gong",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A spell on I: a gong set 40 px ahead rings on the next beats.",
  levels: LEVELS,
  evolution: {
    partner: "j_resonance",
    name: "Temple Bell",
    text: "The gong rings 12 beats, and each ring bursts the Resonance on the foes it reaches.",
    row: evolvedRow(LEVELS[7], "Rings 12 beats and bursts Resonance.", { temple: 1, beats: 12 }),
  },
};
