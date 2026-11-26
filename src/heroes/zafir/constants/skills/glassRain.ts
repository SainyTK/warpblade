import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { shards: 3, power: 0.9, recharge: 4.5 },
  { power: 1.2 },
  { splash: 6 },
  { shards: 4 },
  { power: 2 },
  { aim: 1 },
  { wounds: 1, shards: 5 },
  { power: 4, recharge: 3.5 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Glass Rain blinds 1 s longer.", drill: { blind: 1 } },
  { text: "New: Glass Rain cuts 0.6 harder.", drill: { power: 0.6 } },
  { text: "New: two shards fall on the foes nearest the target.", drill: { shards: 2 } },
  { text: "Glass Rain cut 0.6 to 1.2.", drill: { power: 1.2 } },
  { text: "New: spell cooldowns 20% shorter.", drill: { preparation: 0.8 } },
  { text: "Glass Rain cut 1.2 to 2.4; four shards.", drill: { power: 2.4, shards: 4 } },
  { text: "New: a glass-infused hit sprays shards on the foes beside it.", drill: { spray: 0.6 } },
  { text: "Glass Rain cut 2.4 to 5; blind 2 s longer.", drill: { power: 5, blind: 2 } },
]);

export const GLASS_RAIN: SkillDef = {
  id: "za_glass",
  name: "Glass Rain",
  kind: "spell",
  element: "frost",
  risk: "timed",
  button: "I",
  text: "Glass Rain scours harder: longer blindness, shards that rain on the foes round the target, and shorter spell cooldowns.",
  levels: LEVELS,
  evolution: {
    partner: "za_gale",
    name: "Glass Storm",
    text: "Every glass blast also strikes the nearest foe behind you.",
    row: evolvedRow(LEVELS[7], "A second blast behind you.", { ...drillValues({ behind: 1 }) }),
  },
};
