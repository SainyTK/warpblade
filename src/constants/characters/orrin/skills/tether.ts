import type { SkillDef } from "../../../../types/skill";

/** Tether. Design: docs/skills/orrin.md. Values: mp, cooldown; count: foes chained; share: share of the damage one takes passed to the others; life: seconds; yank: ability power two foes pulled more than 70 px apart deal each other as they are yanked together; burst: ability power the others take when a chained foe dies; gang: 1 every foe on screen is chained (evolution) */
export const TETHER: SkillDef = {
  id: "o_tether",
  name: "Tether",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Chain the nearest foes together so damage to one hurts the others.",
  levels: [
    { text: "Chain 2 foes: 30% of damage is shared.", values: { mp: 22, cooldown: 8, count: 2, share: 0.3, life: 4, yank: 0, burst: 0, gang: 0 } },
    { text: "Chain 3 foes.", values: { mp: 22, cooldown: 8, count: 3, share: 0.3, life: 4, yank: 0, burst: 0, gang: 0 } },
    { text: "45% of damage is shared.", values: { mp: 22, cooldown: 8, count: 3, share: 0.45, life: 4, yank: 0, burst: 0, gang: 0 } },
    { text: "Foes pulled apart are yanked together.", values: { mp: 22, cooldown: 8, count: 3, share: 0.45, life: 4, yank: 1.5, burst: 0, gang: 0 } },
    { text: "The tether lasts 6 s.", values: { mp: 22, cooldown: 8, count: 3, share: 0.45, life: 6, yank: 1.5, burst: 0, gang: 0 } },
    { text: "A chained foe's death hurts the others.", values: { mp: 22, cooldown: 8, count: 3, share: 0.45, life: 6, yank: 1.5, burst: 2, gang: 0 } },
    { text: "60% of damage is shared.", values: { mp: 22, cooldown: 8, count: 3, share: 0.6, life: 6, yank: 1.5, burst: 2, gang: 0 } },
    { text: "Harder yanks and bursts.", values: { mp: 22, cooldown: 8, count: 3, share: 0.6, life: 6, yank: 2.5, burst: 3, gang: 0 } },
  ],
  evolution: {
    partner: "o_bell",
    name: "Chain Gang",
    text: "Every foe on screen is chained together.",
    row: { text: "Every foe on screen is chained.", values: { mp: 22, cooldown: 8, count: 3, share: 0.6, life: 6, yank: 2.5, burst: 3, gang: 1 } },
  },
};
