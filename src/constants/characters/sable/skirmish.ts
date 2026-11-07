import type { LegacyNode } from "../legacySkills";

/** Skirmish: the kick, the hop and the slide that keep foes at range. Steady. */
export const SKIRMISH: readonly LegacyNode[] = [
  {
    id: "k_fleet",
    name: "Fleet Foot",
    kind: "passive",
    text: "Move speed +5% and stamina +10 per rank.",
    ranks: 3,
    stats: { move: 0.05, stamina: 10 },
  },
  {
    id: "k_volley",
    name: "Hop Volley",
    kind: "movement",
    text: "The hop back looses three bolts in a fan instead of one.",
    ranks: 1,
    perk: "hopVolley",
  },
  {
    id: "k_boot",
    name: "Heavy Boot",
    kind: "combo",
    text: "The kick deals twice the damage, holds foes 1 second longer and bounces them off the stage edge.",
    ranks: 1,
    perk: "heavyBoot",
  },
  {
    id: "k_slide",
    name: "Slide Kick",
    kind: "movement",
    text: "The slide trips every foe it passes through.",
    ranks: 1,
    perk: "slideKick",
  },
];
