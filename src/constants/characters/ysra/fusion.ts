import type { SkillBranch } from "../../../types/skill";

/** skills that join two of Ysra's paths */
export const FUSION: SkillBranch = {
  id: "fusion",
  name: "Fusion",
  nodes: [
    {
      id: "x_molten",
      name: "Molten Guard",
      kind: "fusion",
      text: "A parry fills 25 Heat and a block 5.",
      level: 5,
      ranks: 1,
      requires: ["s_parry", "s_counter"],
      crossRequires: ["r_kindle"],
      perk: "moltenGuard",
    },
    {
      id: "x_hotIron",
      name: "Hot Iron",
      kind: "fusion",
      text: "A full lunge above half Heat ends in a free Flame Pillar at the tip.",
      level: 7,
      ranks: 1,
      requires: ["l_skewer", "l_rail"],
      crossRequires: ["r_searing"],
      perk: "hotIron",
    },
    {
      id: "x_skyline",
      name: "Skyline",
      kind: "fusion",
      text: "Vault once more in the air, and an air sweep can follow a vault.",
      level: 6,
      ranks: 1,
      requires: ["l_reaper"],
      crossRequires: ["s_vaultStrike"],
      perk: "skyline",
    },
  ],
};
