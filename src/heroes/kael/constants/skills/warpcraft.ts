import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cost` MP, `recharge` seconds, `thrust` the arrival drives the foe off, `perPx` and `cap` the distance bonus,
 *  `path` power of the thrown sword's cut on its way, `charges`, `behind` the arrival cuts both sides, `strike` power */
const LEVELS = levelRows([
  { text: "Warp costs 6 MP and recharges in 1.5 s.", values: { cost: 6, recharge: 1.5, charges: 1 } },
  { text: "New: the arrival is a lunging thrust that drives foes off.", values: { thrust: 1 } },
  { text: "The longer the warp, the harder it hits.", values: { perPx: 0.025, cap: 5 } },
  { text: "New: the thrown sword cuts every foe on its way.", values: { path: 1 } },
  { text: "New: two warp charges.", values: { charges: 2 } },
  { text: "Recharge 1.5 to 1.1 s.", values: { recharge: 1.1 } },
  { text: "New: the arrival also cuts behind Kael.", values: { behind: 1 } },
  { text: "Warp strike 1.8 to 7; the sword's cut hits harder.", values: { strike: 7, path: 2.5 } },
]);

export const WARPCRAFT: SkillDef = {
  id: "k_warpcraft",
  name: "Warpcraft",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Warp Strike costs less, recharges faster and reaches further, and its arrival hits like a thrust.",
  levels: LEVELS,
  evolution: {
    partner: "k_passing",
    name: "Rift Walker",
    text: "Once every 4 seconds, after an arrival the sword leaps on to 3 more foes and Kael warps to each in turn.",
    row: evolvedRow(LEVELS[7], "The warp chains through 3 more foes.", { chain: 3, chainEvery: 4 }),
  },
};
