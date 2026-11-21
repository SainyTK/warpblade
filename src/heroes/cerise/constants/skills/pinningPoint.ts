import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `halt` seconds a thrust holds a walker's feet, `held` added damage on a held or pinned foe, `behind` the
 *  rising thrust cuts behind too, `reach` px thrusts reach farther, `flurryHalt` Flurry holds feet too; evolved
 *  `pinAll` seconds every thrust pins */
const NATIVE = levelRows([
  { text: "Thrusts hold a walker's feet for 0.4 s.", values: { halt: 0.4 } },
  { text: "New: held and pinned foes take +20% from your blows.", values: { held: 0.2 } },
  { text: "Hold 0.4 to 0.8 s.", values: { halt: 0.8 } },
  { text: "New: the rising thrust also cuts behind you.", values: { behind: 1 } },
  { text: "Held bonus +20% to +40%.", values: { held: 0.4 } },
  { text: "New: thrusts reach 8 px farther.", values: { reach: 8 } },
  { text: "New: Flurry's thrusts hold feet too.", values: { flurryHalt: 1 } },
  { text: "Held bonus +40% to +60%.", values: { held: 0.6 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "The air thrust pins its foe for 0.6 s and strikes again for 0.5 AD.", drill: { pin: 0.6, air: 0.5 } },
  { text: "New: one more air thrust a jump.", drill: { airSlashes: 1 } },
  { text: "Strike 0.5 to 1 AD.", drill: { air: 1 } },
  { text: "Pin 0.6 to 1 s.", drill: { pin: 1 } },
  { text: "New: pinned foes take +20% from every source.", drill: { held: 0.2 } },
  { text: "Strike 1 to 2 AD.", drill: { air: 2 } },
  { text: "New: a third air thrust a jump.", drill: { airSlashes: 2 } },
  { text: "Strike 2 to 4 AD; pin 1.5 s.", drill: { air: 4, pin: 1.5 } },
]);

export const PINNING_POINT: SkillDef = {
  id: "ce_pin",
  name: "Pinning Point",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The air thrust pins its foe and strikes again.",
  levels: LEVELS,
  evolution: {
    partner: "ce_thorns",
    name: "Butterfly Pin",
    text: "Each air thrust also skewers the foes below it.",
    row: evolvedRow(LEVELS[7], "Air thrusts skewer the foes below, 3 AD.", {
      ...drillValues({ skewer: 3 }),
      pinAll: 0.5,
      held: 1.2,
    }),
  },
};
