import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values (the shared warp's tune): `cost` MP, `recharge` seconds, `charges`, `path` the spinning sword cuts each foe
 *  it passes at this power (AD), `strike` the arrival chop's power (AD), `ring` added pixels of the shock ring and
 *  `ringPower` its added power (AD), `wheel` the sword keeps spinning where she lands for this many seconds */
const LEVELS = levelRows([
  { text: "Warp costs 7 MP and recharges in 1.6 s.", values: { cost: 7, recharge: 1.6, charges: 1 } },
  { text: "New: the spinning sword cuts every foe it passes.", values: { path: 0.8 } },
  { text: "New: the shock ring reaches 16 px farther and hits harder.", values: { ring: 16, ringPower: 0.4 } },
  { text: "Recharge 1.6 to 1.2 s.", values: { recharge: 1.2 } },
  { text: "New: two warp charges.", values: { charges: 2 } },
  { text: "The passing cut 0.8 to 2 AD.", values: { path: 2 } },
  { text: "New: the arrival chop hits 3 AD.", values: { strike: 3 } },
  { text: "Chop 3 to 6 AD; the ring and the cut hit far harder.", values: { strike: 6, ringPower: 1.5, path: 3 } },
]);

export const SPINNING_THROW: SkillDef = {
  id: "br_spin",
  name: "Spinning Throw",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The warp costs less and comes back sooner, and the spinning sword cuts on its way.",
  levels: LEVELS,
  evolution: {
    partner: "br_crater",
    name: "Iron Wheel",
    text: "Where she lands, a crimson wheel of the sword keeps spinning and cutting foes round her for 1.5 s.",
    row: evolvedRow(LEVELS[7], "A crimson wheel spins where she lands.", { wheel: 1.5, wheelPower: 1.2 }),
  },
};
