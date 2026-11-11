import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "An on-beat Tap deals 80% more to the first foe.",
    values: { power: 0.8, crit: 0, stun: 0, pierce: 0, sure: 0, gunshot: 0 },
  },
  { text: "+50% crit chance on the crack; 110% more.", values: { power: 1.1, crit: 0.5 } },
  { text: "The crack stuns for 0.5 s.", values: { stun: 0.5 } },
  { text: "The crack deals 150% more.", values: { power: 1.5 } },
  { text: "The crack carries to a second foe, 0.6x.", values: { pierce: 0.6 } },
  { text: "The crack deals 200% more.", values: { power: 2 } },
  { text: "A Rimshot on a bar's downbeat is a sure crit.", values: { sure: 1 } },
  { text: "The crack deals 280% more.", values: { power: 2.8 } },
]);

/** Rimshot. Design: docs/skills/jory.md. Values: power: share more an on-beat Tap deals to the first foe; crit: chance it is a sure crit; stun: seconds it stuns; pierce: attack damage the crack deals to the next foe within 40 px; sure: 1 a Rimshot on a downbeat is a sure crit; gunshot: attack damage of a crack fired 120 px ahead at the first foe (evolution) */
export const RIMSHOT: SkillDef = {
  id: "j_rimshot",
  name: "Rimshot",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "An on-beat Tap cracks the first foe it reaches for a large bonus.",
  levels: LEVELS,
  evolution: {
    partner: "j_tuning",
    name: "Gunshot Snare",
    text: "An on-beat Tap also fires a crack 120 px straight ahead at the first foe for a heavy hit.",
    row: evolvedRow(LEVELS[7], "An on-beat Tap also fires a 120 px crack, 2.5x.", { gunshot: 2.5 }),
  },
};
