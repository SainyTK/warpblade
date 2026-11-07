import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` of the sweep, `reach` in pixels, `drag` pixels it pulls foes in, `behind`, `trip` damage tripped
 *  foes take from the rest of the string, `crescent` the 3rd hit cuts front and back, `flyers` pulled down */
const LEVELS = levelRows([
  { text: "The 1st hit is a low sweep that trips foes and drags them in.", values: { power: 1, reach: 34, drag: 20 } },
  { text: "New: the sweep reaches behind Kael too.", values: { behind: 1 } },
  { text: "Reach 34 to 50 px; drags twice as far.", values: { reach: 50, drag: 40 } },
  { text: "New: tripped foes take +25% damage.", values: { trip: 0.25 } },
  { text: "New: the 3rd hit is a crescent turn, front and back.", values: { crescent: 1 } },
  { text: "New: the sweep pulls flying foes down to the floor.", values: { flyers: 1 } },
  { text: "Sweep power 1 to 2; tripped foes take +40%.", values: { power: 2, trip: 0.4 } },
  { text: "Reach 50 to 70 px; drags them to Kael's feet.", values: { reach: 70, drag: 60 } },
]);

export const REAPING_SWEEP: SkillDef = {
  id: "k_reap",
  name: "Reaping Sweep",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The combo opens with a low sweep that trips foes and drags them into the string.",
  levels: LEVELS,
  evolution: {
    partner: "k_splinters",
    name: "Crystal Harvest",
    text: "The sweep sends a crystal tide along the floor both ways that drags every foe it touches to Kael and lodges splinters.",
    row: evolvedRow(LEVELS[7], "A crystal tide drags foes in from both sides.", { tide: 120, tideSplinters: 3 }),
  },
};
