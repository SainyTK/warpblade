import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "An on-beat jump gives one more jump, on a beat.",
    values: { leaps: 1, ring: 0, power: 0.5, stun: 0, boom: 0, skybeat: 0 },
  },
  { text: "Landing from a leap rings out 30 px, 0.5x.", values: { ring: 30 } },
  { text: "Two more jumps.", values: { leaps: 2 } },
  { text: "The landing ring stuns for 0.4 s.", values: { stun: 0.4 } },
  { text: "A 45 px ring, 0.8x.", values: { ring: 45, power: 0.8 } },
  { text: "Boom in the air costs no stamina.", values: { boom: 1 } },
  { text: "The ring deals 1.2x.", values: { power: 1.2 } },
  { text: "Three more jumps; a 60 px ring.", values: { leaps: 3, ring: 60 } },
]);

/** Downbeat Leap. Design: docs/skills/jory.md. Values: leaps: jumps in the air after an on-beat jump; ring: pixels of the ring his landing sends out after a leap; power: attack damage of that ring; stun: seconds it stuns; boom: 1 Boom in the air costs no stamina; skybeat: 1 each air jump drops a sound blast below him (evolution) */
export const DOWNBEAT_LEAP: SkillDef = {
  id: "j_leap",
  name: "Downbeat Leap",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "A jump pressed on the beat lets Up jump again in the air, on a beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_kickDrum",
    name: "Skybeat",
    text: "Each on-beat air jump drops a sound blast below him.",
    row: evolvedRow(LEVELS[7], "Each air jump drops a sound blast below him.", { skybeat: 1 }),
  },
};
