import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "Ambush deals 40% more.", values: { power: 0.4, stun: 0, keep: 0, cleave: 0, window: 0.5, nightHunter: 0 } },
  { text: "Ambush stuns for 0.6 s.", values: { stun: 0.6 } },
  { text: "Ambush deals 80% more.", values: { power: 0.8 } },
  { text: "An Ambush kill keeps the Veil up.", values: { keep: 1 } },
  { text: "Ambush also cuts foes within 20 px.", values: { cleave: 20 } },
  { text: "The Ambush window after a rise is 0.8 s.", values: { window: 0.8 } },
  { text: "Ambush deals 120% more.", values: { power: 1.2 } },
  { text: "Ambush deals 200% more.", values: { power: 2 } },
]);

/** Ambush. Design: docs/skills/tallis.md. Values: power: share more an Ambush deals; stun: seconds an Ambush stuns its foe; keep: 1 an Ambush that fells its foe keeps the Veil up; cleave: pixels round its foe an Ambush also cuts; window: seconds after a rise in which a blow is an Ambush; nightHunter: 1 an Ambush kill raises the Veil for free (evolution) */
export const AMBUSH: SkillDef = {
  id: "t_ambush",
  name: "Ambush",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "His Ambush, the first blow out of the Veil or out of the pool behind a foe, hits harder.",
  levels: LEVELS,
  evolution: {
    partner: "t_quietStep",
    name: "Night Hunter",
    text: "A foe felled by an Ambush raises the Veil again for free.",
    row: evolvedRow(LEVELS[7], "An Ambush kill raises the Veil for free.", { nightHunter: 1 }),
  },
};
