import { ULT_CHARGE } from "../kael";
import type { LegacyNode } from "../legacySkills";

/** Pyre: Heat and the rites it pays for. Pays off late. */
export const PYRE: readonly LegacyNode[] = [
  {
    id: "r_kindle",
    name: "Kindling",
    kind: "passive",
    text: "Heat builds 20% faster per rank.",
    ranks: 3,
  },
  {
    id: "r_pillar",
    name: "Flame Pillar",
    kind: "spell",
    text: "A rite: spend 40 Heat to burst a pillar of fire under the nearest foe ahead and throw it up. O picks the rite.",
    ranks: 1,
    perk: "flamePillar",
    evolution: {
      partner: "r_kindle",
      name: "Pyre Colonnade",
      text: "Flame Pillar evolves. The pillar burns hotter, and two more pillars burst up on either side of it a moment later.",
      perk: "pyreColonnade",
    },
  },
  {
    id: "r_brazier",
    name: "Brazier",
    kind: "spell",
    text: "A rite: spend 50 Heat to plant a brazier that spits embers at foes for 8 seconds. O picks the rite.",
    ranks: 1,
    perk: "brazier",
  },
  {
    id: "r_searing",
    name: "Searing Edge",
    kind: "enhance",
    text: "Above half Heat the glaive burns, and every blow sets its foe on fire.",
    ranks: 1,
    perk: "searingEdge",
  },
  {
    id: "r_ash",
    name: "Ashen Wake",
    kind: "enhance",
    text: "Vaults, dives and full lunges leave burning ground behind you.",
    ranks: 1,
    perk: "ashenWake",
  },
  {
    id: "r_overheat",
    name: "Overheat",
    kind: "enhance",
    text: "At full Heat, I unleashes Overheat for 6 seconds: attack speed +30% and every blow bursts in flame. Heat empties after.",
    ranks: 1,
    perk: "overheat",
  },
  {
    id: "r_hearth",
    name: "Hearthfire",
    kind: "enhance",
    text: "Rites cost 30% less Heat, and each one heals 4% of your max HP.",
    ranks: 1,
    perk: "hearthfire",
  },
  {
    id: "r_ult",
    name: "Volcanic Rift",
    kind: "ultimate",
    text: `Drive the glaive into the floor: a crack runs out both ways and erupts in pillars of fire. Level 4 splits the whole floor. Grows with ability power. ${ULT_CHARGE}`,
    ranks: 1,
    ultimate: "volcanicRift",
  },
];
