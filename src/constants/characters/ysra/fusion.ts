import type { LegacyNode } from "../legacySkills";

/** skills that join two of Ysra's paths */
export const FUSION: readonly LegacyNode[] = [
  {
    id: "x_molten",
    name: "Molten Guard",
    kind: "fusion",
    text: "A parry fills 25 Heat and a block 5.",
    ranks: 1,
    perk: "moltenGuard",
  },
  {
    id: "x_hotIron",
    name: "Hot Iron",
    kind: "fusion",
    text: "A full lunge above half Heat ends in a free Flame Pillar at the tip.",
    ranks: 1,
    perk: "hotIron",
  },
  {
    id: "x_skyline",
    name: "Skyline",
    kind: "fusion",
    text: "Vault once more in the air, and an air sweep can follow a vault.",
    ranks: 1,
    perk: "skyline",
  },
];
