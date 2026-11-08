import type { SkillDef } from "../../../../types/skill";

/** Ancestor's Fist. Design: docs/skills/hulda.md. Values: chance; cooldown: least seconds between calls; power: attack damage of the slam; throw: 1 grabs the attacker and throws it at the crowd; ring: radius of the half-damage ring (0 none); fury: share of the Fury it gives; second: 1 a second fist slams the nearest other foe; pin: seconds the evolved fist pins foes near; mark: share more damage pinned foes take */
export const ANCESTORS_FIST: SkillDef = {
  id: "h_ancestorFist",
  name: "Ancestor's Fist",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "An armoured counter (a blow taken in the haymaker's wind-up, the rush or Iron Wall) may call a giant fist on the attacker.",
  levels: [
    {
      text: "An armoured counter may call a giant fist.",
      values: { chance: 0.5, cooldown: 3, power: 7, throw: 0, ring: 0, fury: 0, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "The fist hits harder.",
      values: { chance: 0.5, cooldown: 3, power: 12, throw: 0, ring: 0, fury: 0, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "The fist throws the attacker.",
      values: { chance: 0.5, cooldown: 3, power: 12, throw: 1, ring: 0, fury: 0, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "More often.",
      values: { chance: 0.75, cooldown: 2, power: 12, throw: 1, ring: 0, fury: 0, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "The slam strikes foes near.",
      values: { chance: 0.75, cooldown: 2, power: 12, throw: 1, ring: 24, fury: 0, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "Every armoured counter calls it, with Fury.",
      values: { chance: 1, cooldown: 2, power: 12, throw: 1, ring: 24, fury: 0.25, second: 0, pin: 0, mark: 0 },
    },
    {
      text: "A second fist.",
      values: { chance: 1, cooldown: 2, power: 12, throw: 1, ring: 24, fury: 0.25, second: 1, pin: 0, mark: 0 },
    },
    {
      text: "The fist hits far harder.",
      values: { chance: 1, cooldown: 2, power: 100, throw: 1, ring: 24, fury: 0.25, second: 1, pin: 0, mark: 0 },
    },
  ],
  evolution: {
    partner: "h_skyfall",
    name: "Hand of the Mountain",
    text: "A fist twice the size slams for immense damage and pins every foe near, who take far more from you.",
    row: {
      text: "A huge fist pins foes near.",
      values: { chance: 1, cooldown: 2, power: 250, throw: 1, ring: 24, fury: 0.25, second: 1, pin: 1.5, mark: 0.5 },
    },
  },
};
