import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values (the warp's tune): `path` attack damage to foes the thrown katana passes, `pathStore` attack damage it stores
 *  in them, `recharge`, `charges`, `strike` the arrival's power, `cost` MP; `breath` an arrival gives a breath;
 *  `arrival` the factor on the arrival's stored cut; `clean` each arrival's click is a clean sheathe */
const LEVELS = levelRows([
  { text: "The thrown katana cuts the foes it passes.", values: { path: 0.8 } },
  { text: "Warp recharge 2 to 1.6 s.", values: { recharge: 1.6 } },
  { text: "New: foes the katana passes store a cut.", values: { pathStore: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "Arrival power 1.8 to 2.3.", values: { strike: 2.3 } },
  { text: "New: each arrival gives a breath.", values: { breath: 1 } },
  { text: "Warp cost 10 to 6 MP.", values: { cost: 6 } },
  { text: "New: the arrival stores twice as much.", values: { arrival: 2 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Warp recharge -15%, damage +30%.", drill: { cooldown: 0.85, damage: 0.3 } },
  { text: "New: the arrival stores twice as much.", drill: { store: 2 } },
  { text: "New: the arrival restores the air dash and air slash.", drill: { refresh: 1 } },
  { text: "Recharge -25%, damage +80%.", drill: { cooldown: 0.75, damage: 0.8 } },
  { text: "New: the arrival cuts every foe within 30 px for 1.2x AD.", drill: { sweep: 1.2 } },
  { text: "Recharge -35%, damage +150%.", drill: { cooldown: 0.65, damage: 1.5 } },
  { text: "New: a beat after the arrival, every stored cut releases.", drill: { release: 1 } },
  { text: "Recharge -40%, damage +250%; the sweep doubles.", drill: { cooldown: 0.6, damage: 2.5, sweep: 2.4 } },
]);

export const PASSING_DRAW: SkillDef = {
  id: SKILL.pass,
  name: "Passing Draw",
  kind: "movement",
  element: "storm",
  risk: "timed",
  button: "L",
  text: "The warp strike recharges faster, hits harder and stores more.",
  levels: DRILL,
  evolution: {
    partner: SKILL.step,
    name: "Thousand Paces",
    text: "Once every 3 seconds an arrival recharges the warp at once.",
    row: evolvedRow(DRILL[7], "Every 3 s an arrival recharges the warp.", {
      ...drillValues({ reset: 3 }),
      cost: 0,
      recharge: 1,
      clean: 1,
    }),
  },
};
