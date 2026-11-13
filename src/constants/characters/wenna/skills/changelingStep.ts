import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Changeling Step. Design: docs/skills/wenna.md. Values: range: pixels a warp with no foe ahead reaches for a Wick to
 *  trade places with (160 in the base kit); flare: share more the traded Wick's flare deals; charges: warps she can throw
 *  before the first comes back; life: seconds the thrown candle burns as a Wick (4 in the base kit); path: attack damage
 *  foes the thrown candle passes through take; recharge: seconds a spent warp takes to come back (2 in the base kit);
 *  heal: 1 the traded Wick heals to full; mirror: 1 every warp also lights a free Wick beside her, if under the cap
 *  (evolution) */
const LEVELS = levelRows([
  {
    text: "Warps reach Wicks 220 px away; their flare deals 50% more.",
    values: { range: 220, flare: 0.5, charges: 1, life: 4, path: 0, recharge: 2, heal: 0, mirror: 0 },
  },
  { text: "New: two warp charges.", values: { charges: 2 } },
  { text: "The candle left behind burns 8 s.", values: { life: 8 } },
  { text: "New: the thrown candle burns foes it passes for 2x.", values: { path: 2 } },
  { text: "The flare deals 80% more.", values: { flare: 0.8 } },
  { text: "Warps come back in 1.5 s.", values: { recharge: 1.5 } },
  { text: "New: the Wick you trade with heals to full.", values: { heal: 1 } },
  { text: "The flare deals 150% more; the candle burns 12 s.", values: { flare: 1.5, life: 12 } },
]);

export const CHANGELING_STEP: SkillDef = {
  id: "w_swap",
  name: "Changeling Step",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Your warp reaches further for a Wick, and the candle you leave behind burns longer.",
  levels: LEVELS,
  evolution: {
    partner: "w_procession",
    name: "Mirror Wick",
    text: "Every warp also lights a free Wick beside you, if you are under the cap.",
    row: evolvedRow(LEVELS[7], "Each warp lights a free Wick.", { mirror: 1 }),
  },
};
