import type { SkillDef } from "../../../../types/skill";

/** Gaff. Design: docs/skills/orrin.md. Values: power: share more the arrival kick deals; windup: 1 a foe winding up is staggered 1.2 s and the kick crits; hook: 1 the bounce gives a hook back; yank: 1 a hooked minion is yanked along on the bounce; ring: pixels round the arrival every foe takes the kick; momentum: Momentum a crit arrival gives; harpoon: 1 every foe on the chain's line is dragged to the hooked one first (evolution); crit: the kick's damage multiple as a sure crit (evolution) */
export const GAFF: SkillDef = {
  id: "o_gaff",
  name: "Gaff",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "The kick at the end of a zip to a hooked foe hits much harder.",
  levels: [
    { text: "The arrival kick deals 40% more.", values: { power: 0.4, windup: 0, hook: 0, yank: 0, ring: 0, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "A foe winding up reels; the kick crits.", values: { power: 0.4, windup: 1, hook: 0, yank: 0, ring: 0, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "The arrival kick deals 70% more.", values: { power: 0.7, windup: 1, hook: 0, yank: 0, ring: 0, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "The bounce gives a hook back.", values: { power: 0.7, windup: 1, hook: 1, yank: 0, ring: 0, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "A hooked minion comes along on the bounce.", values: { power: 0.7, windup: 1, hook: 1, yank: 1, ring: 0, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "The kick hits every foe within 26 px.", values: { power: 0.7, windup: 1, hook: 1, yank: 1, ring: 26, momentum: 0, harpoon: 0, crit: 0 } },
    { text: "A crit arrival gives 20 Momentum.", values: { power: 0.7, windup: 1, hook: 1, yank: 1, ring: 26, momentum: 20, harpoon: 0, crit: 0 } },
    { text: "The arrival kick deals 140% more.", values: { power: 1.4, windup: 1, hook: 1, yank: 1, ring: 26, momentum: 20, harpoon: 0, crit: 0 } },
  ],
  evolution: {
    partner: "o_sweetspot",
    name: "Harpoon",
    text: "A hook on a foe drags every foe on the chain's line to it before the kick, and the kick is a sure crit for 3x.",
    row: { text: "Drag the line in; a sure crit for 3x.", values: { power: 1.4, windup: 1, hook: 1, yank: 1, ring: 26, momentum: 20, harpoon: 1, crit: 3 } },
  },
};
