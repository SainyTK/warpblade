import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `reach` reach multiple of the arrival spin, `whirl` Whirl it adds, `path` attack damage the thrown scimitar deals to foes it passes, `strike` the arrival blow's power, `wounds` extra wounds the arrival opens, `charges` warps in a row, `ring` the arrival fills the Whirl to the first ring, `cost` MP a warp costs, `keen` the arrival is always Keen */
const LEVELS = levelRows([
  { text: "The arrival spin reaches 20% farther and adds 10 more Whirl.", values: { reach: 1.2, whirl: 10 } },
  { text: "New: the thrown scimitar cuts foes it passes.", values: { path: 0.5 } },
  { text: "New: the arrival opens one more wound.", values: { wounds: 1 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "Path cut 0.5 to 0.8; the arrival 1.8 to 2.4.", values: { path: 0.8, strike: 2.4 } },
  { text: "New: the arrival fills the Whirl to the first ring.", values: { ring: 1 } },
  { text: "Warps cost 10 to 7 MP.", values: { cost: 7 } },
  {
    text: "Path cut 0.8 to 1.6; the arrival 2.4 to 3; reach 20% to 40%.",
    values: { path: 1.6, strike: 3, reach: 1.4 },
  },
]);

export const WHIRLWIND_ARRIVAL: SkillDef = {
  id: "za_arrival",
  name: "Whirlwind Arrival",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Your warp arrives in a wider spin that feeds the Whirl, and its thrown scimitar cuts on the way.",
  levels: LEVELS,
  evolution: {
    partner: "za_sirocco",
    name: "Dust Devil Step",
    text: "The arrival is always Keen and leaves every foe round you with three more wounds.",
    row: evolvedRow(LEVELS[7], "Always Keen; three more wounds.", { keen: 1, wounds: 3 }),
  },
};
