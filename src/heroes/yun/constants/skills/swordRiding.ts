import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Warp recharge -15%; warp damage +30%.", drill: { cooldown: 0.85, damage: 0.3 } },
  { text: "New: 2 spirit swords strike the foe you arrive at for 0.5 AD.", drill: { swords: 2, power: 0.5 } },
  { text: "Warp recharge -25%.", drill: { cooldown: 0.75 } },
  { text: "New: an arrival restores the air dash and the air cut.", drill: { refresh: 1 } },
  { text: "Warp damage +80%; swords 1 AD.", drill: { damage: 0.8, power: 1 } },
  { text: "New: four swords follow you in.", drill: { swords: 4 } },
  { text: "Warp recharge -40%.", drill: { cooldown: 0.6 } },
  { text: "Warp damage +200%; swords 2.2 AD.", drill: { damage: 2, power: 2.2 } },
]);

export const SWORD_RIDING: SkillDef = {
  id: "yu_ride",
  name: "Sword Riding",
  kind: "movement",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "The warp strike recharges faster and hits harder, and spirit swords follow you in.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_echo",
    name: "Riding the Wind",
    text: "Once every 4 seconds an arrival recharges the warp at once.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Half MP; the arrival is echoed.", { cost: 5, echo: 1 }),
      "Every 4 s an arrival recharges the warp.",
      { every: 4 },
    ),
  },
};
