import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of the element on the foe the warp lands on, `burn`, `chill` and `shock` seconds of its
 *  status, `window` seconds after an arrival in which a cast is a Spellblade cast, `reach` pixels round the foe the
 *  element also strikes, `half` share of MP that cast costs, `refund` seconds taken off the selected ability's recharge,
 *  `arcaneEvery` seconds between Arcane Arrival's free casts */
const LEVELS = levelRows([
  {
    text: "The warp lands with the selected ability's element: fire burns, ice slows, lightning shocks.",
    values: { power: 0.6, burn: 2, chill: 1.5, shock: 1 },
  },
  { text: "New: a cast just after a warp is a Spellblade cast.", values: { window: 1 } },
  { text: "Element power 0.6 to 1.2.", values: { power: 1.2 } },
  { text: "New: the element also strikes foes beside the one you land on.", values: { reach: 30 } },
  { text: "New: that Spellblade cast costs half the MP.", values: { half: 0.5 } },
  { text: "Element power 1.2 to 2; the window lasts 1.5 s.", values: { power: 2, window: 1.5 } },
  { text: "New: each warp takes 1 s off the selected ability's recharge.", values: { refund: 1 } },
  { text: "Element power 2 to 4.5; statuses last longer.", values: { power: 4.5, burn: 3, chill: 2.5, shock: 1.5 } },
]);

export const SPELLWARP: SkillDef = {
  id: "k_spellwarp",
  name: "Spellwarp",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The warp lands with the element of the ability selected on I, and a cast right after it leaves the hand at once.",
  levels: LEVELS,
  evolution: {
    partner: "k_warpcraft",
    name: "Arcane Arrival",
    text: "Once every 3 seconds, a warp arrival also casts the selected ability for free at half power.",
    row: evolvedRow(LEVELS[7], "Every 3 s an arrival casts the selected ability free.", { arcaneEvery: 3 }),
  },
};
