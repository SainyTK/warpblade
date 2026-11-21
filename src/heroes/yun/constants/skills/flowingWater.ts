import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `keen` share of extra power a Keen blow deals on its foe, `window` seconds added to Keen timing, `sword` seconds between spirit swords a Keen blow gives, `wave` power of the qi wave a Keen blow sends, in attack damage, `waves` how many waves, `lift` a Keen blow throws an airborne foe up */
const LEVELS = levelRows([
  { text: "A Keen blow hits twice as hard on its foe.", values: { keen: 1 } },
  { text: "Keen bonus 100% to 160%.", values: { keen: 1.6 } },
  { text: "New: Keen timing is 0.05 s longer.", values: { window: 0.05 } },
  { text: "Keen bonus 160% to 250%.", values: { keen: 2.5 } },
  { text: "New: a Keen blow gives a spirit sword, once every 2 s.", values: { sword: 2 } },
  { text: "Keen bonus 250% to 400%.", values: { keen: 4 } },
  { text: "New: a Keen blow sends a qi wave at its foe.", values: { wave: 1, waves: 1 } },
  { text: "New: a Keen blow on a foe in the air throws it higher; bonus 600%.", values: { keen: 6, wave: 4, lift: 1 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "A landed Willow Cut sends a qi wave 60 px ahead for 0.8 AD.", drill: { wave: 0.8, reach: 60 } },
  { text: "New: the wave staggers foes.", drill: { stagger: 0.4 } },
  { text: "New: a half wave runs behind you too.", drill: { behind: 1 } },
  { text: "Wave 0.8 to 1.6 AD.", drill: { wave: 1.6 } },
  { text: "New: every cut reaches 15% further.", drill: { reachShare: 1.15 } },
  { text: "Wave 3 AD; it runs 90 px.", drill: { wave: 3, reach: 90 } },
  { text: "New: a second wave at head height.", drill: { twin: 1 } },
  { text: "Wave 6 AD.", drill: { wave: 6 } },
]);

export const FLOWING_WATER: SkillDef = {
  id: "yu_flow",
  name: "Flowing Water",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Willow Cut, the first cut, sends a qi wave ahead.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_echo",
    name: "Still Water",
    text: "The waves run 160 px and hold the feet of each foe they cut.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Keen bonus 900%; three waves.", { keen: 9, waves: 3 }),
      "Waves run 160 px and hold feet.",
      { still: 160, halt: 1 },
    ),
  },
};
