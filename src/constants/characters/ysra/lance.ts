import { ULT_CHARGE } from "../kael";
import type { LegacyNode } from "../legacySkills";

/** Lance: reach, held lunges and the glaive string. Pays off early. */
export const LANCE: readonly LegacyNode[] = [
  {
    id: "l_haft",
    name: "Long Haft",
    kind: "passive",
    text: "Attack damage +6% and glaive reach +3 per rank.",
    ranks: 3,
    scale: { ad: 0.06 },
  },
  {
    id: "l_heft",
    name: "Deep Heft",
    kind: "enhance",
    text: "Holding J winds the lunge 30% faster per rank, and the lunge reaches farther.",
    ranks: 2,
  },
  {
    id: "l_skewer",
    name: "Skewer",
    kind: "combo",
    text: "A full lunge carries the first foe on the blade and slams it into the floor at the end.",
    ranks: 1,
    perk: "skewer",
  },
  {
    id: "l_rail",
    name: "Rail Lance",
    kind: "combo",
    text: "A full lunge runs through every foe in the line, hitting each one twice.",
    ranks: 1,
    perk: "railLance",
  },
  {
    id: "l_windmill",
    name: "Windmill",
    kind: "combo",
    text: "Down + J becomes a spin over your head that hits both sides four times and draws foes in.",
    ranks: 1,
    perk: "windmill",
  },
  {
    id: "l_reaper",
    name: "High Reaper",
    kind: "combo",
    text: "One more air sweep before you land, and air sweeps lift foes with you.",
    ranks: 1,
    perk: "highReaper",
  },
  {
    id: "l_impale",
    name: "Impale",
    kind: "combo",
    text: "The last blow of a full string pins the foe to the floor. Pinned foes take 50% more damage.",
    ranks: 1,
    perk: "impale",
  },
  {
    id: "l_ult",
    name: "Sunspear",
    kind: "ultimate",
    text: `Hurl a burning spear the length of the stage. It pierces every foe in the line and bursts at the end. Level 3 throws one each way, level 4 rains them across the stage. Grows with attack damage. ${ULT_CHARGE}`,
    ranks: 1,
    ultimate: "sunspear",
  },
];
