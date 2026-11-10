import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "Drop Stab deals 30% more.", values: { power: 0.3, ring: 0, spike: 0, jumpBack: 0, fallingNight: 0 } },
  { text: "Landing sends out a 24 px shock ring.", values: { ring: 24 } },
  { text: "Drop Stab deals 45% more.", values: { power: 0.45 } },
  { text: "Drop Stab spikes foes in the air.", values: { spike: 1 } },
  { text: "A Drop Stab hit gives the jump back.", values: { jumpBack: 1 } },
  { text: "The ring reaches 36 px.", values: { ring: 36 } },
  { text: "Drop Stab deals 65% more.", values: { power: 0.65 } },
  { text: "Drop Stab deals 100% more.", values: { power: 1 } },
]);

/** Plunge. Design: docs/skills/tallis.md. Values: power: share more Drop Stab deals; ring: radius of a shock ring where it lands (0 for none); spike: 1 it drives a foe in the air into the floor; jumpBack: 1 a Drop Stab that lands a hit gives his jump back; ring power is half the stab's; fallingNight: 1 a Drop Stab from the Veil keeps the Veil and its ring blinds 2 s (evolution) */
export const PLUNGE: SkillDef = {
  id: "t_plunge",
  name: "Plunge",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Drop Stab hits harder and shakes the floor where he lands.",
  levels: LEVELS,
  evolution: {
    partner: "t_nightLeap",
    name: "Falling Night",
    text: "A Drop Stab from the Veil keeps the Veil up, and its ring blinds foes for 2 s.",
    row: evolvedRow(LEVELS[7], "Drop Stab keeps the Veil; its ring blinds.", { fallingNight: 1 }),
  },
};
