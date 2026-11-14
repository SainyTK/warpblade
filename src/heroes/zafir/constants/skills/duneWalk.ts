import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `walk` share of his walk speed while he spins, `trail` attack damage the sand trail he leaves while walking through a spin deals to each foe on it every 0.3 s, `trailWounds` wounds it opens, `trailWide` its width multiple, `trailHalt` seconds it holds a walker's feet, `trailLife` its life multiple */
const LEVELS = levelRows([
  { text: "Walk through your spins at 70% speed.", values: { walk: 0.7 } },
  { text: "Walk 70% to 85%.", values: { walk: 0.85 } },
  { text: "New: walking through a spin leaves a sand trail that cuts foes on it.", values: { trail: 0.25 } },
  { text: "Walk at full speed through your spins.", values: { walk: 1 } },
  { text: "New: the trail opens a wound.", values: { trailWounds: 1 } },
  { text: "New: the trail spreads twice as wide; trail 0.25 to 0.4.", values: { trailWide: 2, trail: 0.4 } },
  { text: "New: the trail holds walkers' feet.", values: { trailHalt: 0.6 } },
  { text: "Trail 0.4 to 0.65; it lasts twice as long.", values: { trail: 0.65, trailLife: 2 } },
]);

export const DUNE_WALK: SkillDef = {
  id: "za_dune",
  name: "Dune Walk",
  kind: "movement",
  risk: "easy",
  button: "J",
  text: "Walk faster through your spins, leaving a trail of sand that cuts.",
  levels: LEVELS,
  evolution: {
    partner: "za_twofaced",
    name: "Shifting Sands",
    text: "Walk through your spins at run speed; the trail opens two wounds.",
    row: evolvedRow(LEVELS[7], "Spin at run speed; the trail opens two wounds.", { walk: 1.8, trailWounds: 2 }),
  },
};
