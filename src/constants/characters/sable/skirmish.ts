import type { SkillBranch } from "../../../types/skill";

/** Skirmish: the kick, the hop and the slide that keep foes at range. Steady. */
export const SKIRMISH: SkillBranch = {
  id: "skirmish",
  name: "Skirmish",
  pace: "steady",
  nodes: [
    {
      id: "k_fleet",
      name: "Fleet Foot",
      kind: "passive",
      text: "Move speed +5% and stamina +10 per rank.",
      level: 1,
      ranks: 3,
      requires: [],
      stats: { move: 0.05, stamina: 10 },
    },
    {
      id: "k_volley",
      name: "Hop Volley",
      kind: "movement",
      text: "The hop back looses three bolts in a fan instead of one.",
      level: 6,
      ranks: 1,
      requires: ["k_fleet"],
      perk: "hopVolley",
    },
    {
      id: "k_boot",
      name: "Heavy Boot",
      kind: "combo",
      text: "The kick deals twice the damage, holds foes 1 second longer and bounces them off the stage edge.",
      level: 8,
      ranks: 1,
      requires: ["k_fleet"],
      perk: "heavyBoot",
    },
    {
      id: "k_slide",
      name: "Slide Kick",
      kind: "movement",
      text: "The slide trips every foe it passes through.",
      level: 11,
      ranks: 1,
      requires: ["k_volley", "k_boot"],
      perk: "slideKick",
    },
  ],
};
