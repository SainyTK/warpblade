import type { SkillDef } from "../../../../types/skill";

/** Iron Weight. Design: docs/skills/orrin.md. Values: power: share more the string deals; radius: pixels Full Circle reaches further; lift: share higher Rising Arc launches; turns: times Full Circle turns (each after the first at half); knock: attack damage a foe knocked into another deals to it; ball: 1 the hook is a spiked ball (evolution) */
export const IRON_WEIGHT: SkillDef = {
  id: "o_ironweight",
  name: "Iron Weight",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "A heavier hook: the string hits harder and Full Circle grows.",
  levels: [
    { text: "The string deals 15% more.", values: { power: 0.15, radius: 0, lift: 0, turns: 1, knock: 0, ball: 0 } },
    {
      text: "+20%, Full Circle reaches 6 px further.",
      values: { power: 0.2, radius: 6, lift: 0, turns: 1, knock: 0, ball: 0 },
    },
    { text: "Rising Arc launches higher.", values: { power: 0.2, radius: 6, lift: 0.4, turns: 1, knock: 0, ball: 0 } },
    { text: "The string deals 30% more.", values: { power: 0.3, radius: 6, lift: 0.4, turns: 1, knock: 0, ball: 0 } },
    {
      text: "Full Circle turns twice, the second at half.",
      values: { power: 0.3, radius: 6, lift: 0.4, turns: 2, knock: 0, ball: 0 },
    },
    { text: "The string deals 40% more.", values: { power: 0.4, radius: 6, lift: 0.4, turns: 2, knock: 0, ball: 0 } },
    {
      text: "Foes knocked into others hit them.",
      values: { power: 0.4, radius: 6, lift: 0.4, turns: 2, knock: 0.5, ball: 0 },
    },
    { text: "The string deals 60% more.", values: { power: 0.6, radius: 6, lift: 0.4, turns: 2, knock: 0.5, ball: 0 } },
  ],
  evolution: {
    partner: "o_reelsnap",
    name: "Wrecking Ball",
    text: "The hook becomes a spiked iron ball, and Full Circle turns three times at radius 72.",
    row: {
      text: "A spiked ball: three turns at radius 72.",
      values: { power: 0.6, radius: 14, lift: 0.4, turns: 3, knock: 0.5, ball: 1 },
    },
  },
};
