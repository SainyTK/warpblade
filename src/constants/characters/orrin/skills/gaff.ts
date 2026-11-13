import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Gaff, his warp skill. Design: docs/skills/orrin.md. Values: cost: MP a warp costs; recharge: seconds; charges: warps
 *  in a row; strike: the warp kick's power as attack damage; windup: 1 a foe winding up reels 1.2 s and the kick crits;
 *  path: attack damage the thrown hook deals to foes on its way; ring: pixels round the kick every foe takes it;
 *  momentum: Momentum a crit kick gives; harpoon: pixels round the hooked foe from which foes are dragged in to it first
 *  (evolution); sure: 1 the kick always crits (evolution) */
const LEVELS = levelRows([
  {
    text: "The warp kick deals 2.4x, costs 6 MP and recharges in 1.5 s.",
    values: { cost: 6, recharge: 1.5, charges: 1, strike: 2.4 },
  },
  { text: "New: a foe winding up reels 1.2 s and the kick crits.", values: { windup: 1 } },
  { text: "New: the thrown hook cuts every foe on its way.", values: { path: 1 } },
  { text: "New: two warp charges.", values: { charges: 2 } },
  { text: "New: the kick hits every foe within 26 px.", values: { ring: 26 } },
  { text: "Recharge 1.5 to 1.1 s.", values: { recharge: 1.1 } },
  { text: "New: a crit kick gives 20 Momentum.", values: { momentum: 20 } },
  { text: "Warp kick 2.4 to 6.5; the hook's cut hits harder.", values: { strike: 6.5, path: 2 } },
]);

export const GAFF: SkillDef = {
  id: "o_gaff",
  name: "Gaff",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "The warp kick hits harder, costs less and comes back sooner, and catches a foe winding up.",
  levels: LEVELS,
  evolution: {
    partner: "o_sweetspot",
    name: "Harpoon",
    text: "Every foe within 80 px of the hooked one is dragged in to it before the kick, and the kick always crits.",
    row: evolvedRow(LEVELS[7], "Drag the foes round it in; the kick always crits.", { harpoon: 80, sure: 1 }),
  },
};
