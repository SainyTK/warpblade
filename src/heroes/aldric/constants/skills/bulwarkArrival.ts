import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `time` seconds added to Bulwark, `blows` more blows it takes, `recharge` seconds the warp takes to come back, `ring` attack damage of a ring of light on arrival, `strike` the arrival blow's power, `cost` MP a warp costs, `shatter` attack damage of a burst when Bulwark breaks, `charges` warps in a row */
const LEVELS = levelRows([
  { text: "Bulwark lasts 1.5 s longer.", values: { time: 1.5 } },
  { text: "Warp recharge 2 to 1.6 s.", values: { recharge: 1.6 } },
  { text: "New: the arrival sends out a ring of light.", values: { ring: 0.8 } },
  { text: "New: Bulwark takes two blows.", values: { blows: 1 } },
  { text: "Arrival blow 1.8 to 2.4.", values: { strike: 2.4 } },
  { text: "New: a warp costs 6 MP.", values: { cost: 6 } },
  { text: "New: Bulwark bursts with light when it breaks.", values: { shatter: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
]);

export const BULWARK_ARRIVAL: SkillDef = {
  id: "al_bulwark",
  name: "Bulwark Arrival",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The warp's Bulwark lasts longer and takes more, the warp comes back sooner, and the arrival rings with light.",
  levels: LEVELS,
  evolution: {
    partner: "al_oathsworn",
    name: "Twin Bulwark",
    text: "Every arrival calls an Oathsworn knight to cut beside him, and Bulwark takes three blows.",
    row: evolvedRow(LEVELS[7], "Arrival calls a knight; Bulwark takes 3.", { blows: 2, knight: 1 }),
  },
};
