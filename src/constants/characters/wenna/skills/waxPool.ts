import type { SkillDef } from "../../../../types/skill";

/** Wax Pool. Design: docs/skills/wenna.md. Values: mp: MP a cast costs; cooldown: seconds; width: the pool's width on the floor ahead; life: seconds it lies; foes on it are chilled; heal: HP a second Wicks on it heal; power: ability power foes on it take each 0.5 s; bite: share faster Wicks on it bite; pools: pools each cast lays; hearth: 1 the pool follows her and covers 140 px (evolution) */
export const WAX_POOL: SkillDef = {
  id: "w_waxPool",
  name: "Wax Pool",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Pour a pool of hot wax ahead that chills foes and mends Wicks.",
  levels: [
    {
      text: "A 70 px pool for 5 s chills foes, mends Wicks.",
      values: { mp: 20, cooldown: 8, width: 70, life: 5, heal: 4, power: 0, bite: 0, pools: 1, hearth: 0 },
    },
    {
      text: "The pool is 90 px wide.",
      values: { mp: 20, cooldown: 8, width: 90, life: 5, heal: 4, power: 0, bite: 0, pools: 1, hearth: 0 },
    },
    {
      text: "Foes on it take 0.3x each 0.5 s.",
      values: { mp: 20, cooldown: 8, width: 90, life: 5, heal: 4, power: 0.3, bite: 0, pools: 1, hearth: 0 },
    },
    {
      text: "Wicks on it bite 25% faster.",
      values: { mp: 20, cooldown: 8, width: 90, life: 5, heal: 4, power: 0.3, bite: 0.25, pools: 1, hearth: 0 },
    },
    {
      text: "The pool lasts 8 s.",
      values: { mp: 20, cooldown: 8, width: 90, life: 8, heal: 4, power: 0.3, bite: 0.25, pools: 1, hearth: 0 },
    },
    {
      text: "Foes on it take 0.4x.",
      values: { mp: 20, cooldown: 8, width: 90, life: 8, heal: 4, power: 0.4, bite: 0.25, pools: 1, hearth: 0 },
    },
    {
      text: "Two pools.",
      values: { mp: 20, cooldown: 8, width: 90, life: 8, heal: 4, power: 0.4, bite: 0.25, pools: 2, hearth: 0 },
    },
    {
      text: "Foes on it take 0.5x.",
      values: { mp: 20, cooldown: 8, width: 90, life: 8, heal: 4, power: 0.5, bite: 0.25, pools: 2, hearth: 0 },
    },
  ],
  evolution: {
    partner: "w_procession",
    name: "Hearth",
    text: "The pool follows her and covers 140 px.",
    row: {
      text: "The pool follows you, 140 px wide.",
      values: { mp: 20, cooldown: 8, width: 90, life: 8, heal: 4, power: 0.5, bite: 0.25, pools: 2, hearth: 1 },
    },
  },
};
