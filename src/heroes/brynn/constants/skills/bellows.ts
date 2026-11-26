import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "Heft builds 20% faster.", values: { heftGain: 0.2 } },
    { text: "New: Heft waits 2 s longer before it drains.", values: { hold: 2 } },
    { text: "New: at full Heft her swings are 15% faster.", values: { speed: 0.15 } },
    { text: "Heft builds 20% to 40% faster.", values: { heftGain: 0.4 } },
    { text: "New: at full Heft stamina comes back 20 a second.", values: { stamina: 20 } },
    { text: "Swings at full Heft 15% to 25% faster.", values: { speed: 0.25 } },
    { text: "New: at full Heft her hits deal +20%.", values: { damage: 0.2 } },
    { text: "Heft builds 40% to 80% faster; full Heft hits +35%.", values: { heftGain: 0.8, damage: 0.35 } },
  ],
  [
    { text: "Rend lays 2 more bleed stacks.", drill: { bleed: 2 } },
    { text: "New: Rend's hit blasts for 0.5 AD.", drill: { blast: 0.5 } },
    { text: "New: a slash on a bleeding foe opens the wound for 0.4 AD.", drill: { open: 0.4 } },
    { text: "Blast 0.5 to 1 AD.", drill: { blast: 1 } },
    { text: "New: Rend splits into a second shard.", drill: { split: 1 } },
    { text: "Blast 1 to 2 AD; open 0.8 AD.", drill: { blast: 2, open: 0.8 } },
    { text: "New: Rend splits into three shards.", drill: { split: 2 } },
    { text: "Blast 2 to 4 AD.", drill: { blast: 4 } },
  ],
);

export const BELLOWS: SkillDef = {
  id: "br_bellows",
  name: "Bloodletter",
  kind: "spell",
  element: "venom",
  risk: "timed",
  button: "I",
  pact: PACT.blood,
  text: "Rend cuts deeper bleeding wounds.",
  levels: LEVELS,
  evolution: {
    partner: "br_crush",
    name: "Red Tide",
    text: "Each Rend that strikes runs a floor wave on along its line.",
    row: evolvedRow(LEVELS[7], "Rend runs a floor wave on.", {
      ...drillValues({ tide: 2 }),
      keep: 0.5,
    }),
  },
};
