import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { walk: 0.7 },
  { walk: 0.85 },
  { trail: 0.25 },
  { walk: 1 },
  { trailWounds: 1 },
  { trailWide: 2, trail: 0.4 },
  { trailHalt: 0.6 },
  { trail: 0.65, trailLife: 2 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A dash through foes cuts them for 0.6 attack damage.", drill: { cut: 0.6 } },
  { text: "New: the dash cut opens a wound.", drill: { wounds: 1 } },
  { text: "New: stepping through a slash leaves a sand trail that cuts foes on it." },
  { text: "Dash cut 0.6 to 1.2.", drill: { cut: 1.2 } },
  { text: "New: the trail opens a wound; the dash cut opens two.", drill: { wounds: 2 } },
  { text: "New: the trail spreads twice as wide; the dash cut staggers.", drill: { stagger: 0.3 } },
  { text: "New: the trail holds walkers' feet; a dash cut adds 15 Whirl.", drill: { whirl: 15 } },
  { text: "Dash cut 1.2 to 5; the trail lasts twice as long.", drill: { cut: 5 } },
]);

export const DUNE_WALK: SkillDef = {
  id: "za_dune",
  name: "Dune Walk",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Dashing through foes cuts them, and stepping through your slashes leaves a trail of sand that cuts.",
  levels: LEVELS,
  evolution: {
    partner: "za_twofaced",
    name: "Shifting Sands",
    text: "Every dash throws a sand crescent out each side as it ends, and the trail opens two wounds.",
    row: evolvedRow(LEVELS[7], "Dashes throw a crescent each way.", {
      walk: 1.8,
      trailWounds: 2,
      ...drillValues({ crescent: 2 }),
    }),
  },
};
