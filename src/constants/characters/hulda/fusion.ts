import type { SkillBranch } from "../../../types/skill";

/** skills that join two of Hulda's paths */
export const FUSION: SkillBranch = {
  id: "fusion",
  name: "Fusion",
  nodes: [
    {
      id: "x_rushGrab",
      name: "Rush Grab",
      kind: "fusion",
      text: "A Bull Rush that hits a minion takes it into your hands.",
      level: 5,
      ranks: 1,
      requires: ["i_horns"],
      crossRequires: ["h_grip"],
      perk: "rushGrab",
    },
    {
      id: "x_aftershock",
      name: "Aftershock Suplex",
      kind: "fusion",
      text: "The suplex and Skyfall Grab rings are 50% wider and throw minions up.",
      level: 6,
      ranks: 1,
      requires: ["b_uppercut"],
      crossRequires: ["h_swing"],
      perk: "aftershockSuplex",
    },
  ],
};
