import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  {
    values: { power: 1.65, reach: 34, drag: 20 },
  },
  { values: { behind: 1 } },
  { values: { reach: 50, drag: 40 } },
  { values: { trip: 0.25 } },
  { values: { crescent: 1 } },
  { values: { flyers: 1 } },
  { values: { power: 3.3, trip: 0.4 } },
  { values: { reach: 70, drag: 60 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The first slash drags foes in.", drill: { pull: 60 } },
  { text: "New: the sweep cuts 0.4 AD more.", drill: { sweep: 0.4 } },
  { text: "New: the sweep trips foes.", drill: { trip: 0.35 } },
  { text: "All slashes reach 15% further.", drill: { reach: 0.15 } },
  { text: "New: the sweep also cuts foes just behind Kael.", drill: { behind: 0.4 } },
  { text: "Sweep 0.4 to 1 AD; a stronger pull.", drill: { sweep: 1, pull: 90 } },
  { text: "New: the sweep chills foes.", drill: { chill: 2 } },
  { text: "Sweep 1 to 2.5 AD; slashes reach 30% further.", drill: { sweep: 2.5, reach: 0.3 } },
]);

export const REAPING_SWEEP: SkillDef = {
  id: "k_reap",
  name: "Reaping Sweep",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The first slash sweeps and drags foes into the chain.",
  levels: LEVELS,
  evolution: {
    partner: "k_splinters",
    name: "Crystal Harvest",
    text: "The sweep reaps every foe up to 140 px ahead and drags them in.",
    row: evolvedRow(LEVELS[7], "The sweep reaps foes up to 140 px ahead.", {
      ...drillValues({ harvest: 140 }),
      tide: 120,
      tideSplinters: 3,
    }),
  },
};
