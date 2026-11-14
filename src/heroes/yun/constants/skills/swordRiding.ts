import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `arrive` multiplies the spirit swords' arrival strikes, `recharge` seconds a warp takes to come back, `path` attack damage the thrown jian deals to each foe it passes, `gain` spirit swords that join on arrival, `charges` warps in a row, `spread` pixels round the foe the arrival swords also strike, `cost` MP a warp costs, `echo` the arrival is echoed by every sword */
const LEVELS = levelRows([
  { text: "Arrival swords strike twice as hard.", values: { arrive: 2 } },
  { text: "Warp recharge 2 s to 1.6 s.", values: { recharge: 1.6 } },
  { text: "New: the thrown jian cuts every foe it passes.", values: { path: 0.6 } },
  { text: "Arrival swords x2 to x3.", values: { arrive: 3 } },
  { text: "New: a spirit sword joins you on arrival.", values: { gain: 1 } },
  { text: "Warp recharge 1.6 s to 1.2 s.", values: { recharge: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "New: arrival swords also strike foes near the one you reach; x4.", values: { spread: 40, arrive: 4 } },
]);

export const SWORD_RIDING: SkillDef = {
  id: "yu_ride",
  name: "Sword Riding",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The warp grows: harder arrival swords, a shorter recharge, a cutting throw and more warps.",
  levels: LEVELS,
  evolution: {
    partner: "yu_echo",
    name: "Riding the Wind",
    text: "Warps cost half the MP, and every sword echoes the arrival blow.",
    row: evolvedRow(LEVELS[7], "Half MP; the arrival is echoed.", { cost: 5, echo: 1 }),
  },
};
