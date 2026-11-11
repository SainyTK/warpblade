import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "8 on-beat presses in a row: it strikes 6 beats, 0.6x.",
    values: { streak: 8, beats: 6, power: 0.6, stagger: 0, conductor: 0 },
  },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "It strikes 8 beats.", values: { beats: 8 } },
  { text: "6 presses in a row call it.", values: { streak: 6 } },
  { text: "1.1x.", values: { power: 1.1 } },
  { text: "Its strikes stagger.", values: { stagger: 1 } },
  { text: "1.5x.", values: { power: 1.5 } },
  { text: "2x; 10 beats.", values: { power: 2, beats: 10 } },
]);

/** Iron Metronome. Design: docs/skills/jory.md. Values: streak: on-beat presses in a row that call it; beats: beats it strikes; power: attack damage each strike deals; stagger: 1 strikes stagger; conductor: 1 it stays while Crescendo lasts and every strike staggers (evolution) */
export const IRON_METRONOME: SkillDef = {
  id: "j_metronome",
  name: "Iron Metronome",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "After on-beat presses in a row, an iron metronome drops beside the nearest foe and strikes on each beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_swell",
    name: "Conductor",
    text: "It stays while Crescendo lasts, and every strike staggers.",
    row: evolvedRow(LEVELS[7], "It stays through Crescendo.", { conductor: 1, stagger: 1 }),
  },
};
