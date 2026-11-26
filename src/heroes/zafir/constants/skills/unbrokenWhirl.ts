import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { hold: 1.6 },
  { gain: 1.3 },
  { lower: 10 },
  { reach: 1.2 },
  { hold: 2.2 },
  { power: 0.1 },
  { reach: 1.35, gain: 1.5 },
  { power: 0.25, lower: 20 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "An arrival adds 30 Whirl; the Whirl holds 0.5 s longer.", drill: { whirl: 30 } },
  { text: "New: hits fill the Whirl 30% faster." },
  {
    text: "New: an arrival infuses the scimitar with the selected spell for 1 hit; the ring turns from 10 less Whirl.",
    drill: { infuse: 1 },
  },
  { text: "New: the ring reaches 20% farther; spells prepare 15% faster.", drill: { preparation: 0.85 } },
  { text: "Arrival infusion 1 to 2 hits; the Whirl holds 2.2 s.", drill: { infuse: 2 } },
  { text: "New: an arrival cuts 1 s off a spell being prepared; the ring cuts 0.1 harder.", drill: { shorten: 1 } },
  { text: "Spells prepare 15% to 30% faster; the ring 35% farther, fills 50% faster.", drill: { preparation: 0.7 } },
  { text: "Arrival infusion 2 to 3 hits; the ring cuts harder and turns from 20 less Whirl.", drill: { infuse: 3 } },
]);

export const UNBROKEN_WHIRL: SkillDef = {
  id: "za_unbroken",
  name: "Unbroken Whirl",
  kind: "movement",
  element: "storm",
  risk: "easy",
  button: "L",
  text: "The warp feeds the Whirl and the blade: an arrival fills the Whirl and pours the selected spell into the scimitar.",
  levels: LEVELS,
  evolution: {
    partner: "za_whirling",
    name: "Eye of the Dune",
    text: "The Whirl never drains below the first ring, and every arrival readies the selected spell.",
    row: evolvedRow(LEVELS[7], "The Whirl holds its first ring; arrivals ready the spell.", {
      floor: 1,
      ...drillValues({ ready: 1 }),
    }),
  },
};
