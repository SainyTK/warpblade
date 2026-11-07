import type { SkillDef } from "../../../../types/skill";

/** Longshot: Bolts hit harder the farther they fly, so keeping range pays. Values: far: pixels of flight past which a hit is far; bonus: damage added to a far hit; crit: crit chance added to a far hit; range: pixels; mark, markTime: damage taken added by a far hit's mark and its seconds; refund: a far kill puts the bolt back; sweet: the last fifth of the flight always crits; split: a far hit splits into seeking bolts. Design: docs/skills/sable.md */
export const LONGSHOT: SkillDef = {
  id: "s_longshot",
  name: "Longshot",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Bolts hit harder the farther they fly, so keeping range pays.",
  levels: [
    {
      text: "Bolts that fly past half range hit 30% harder.",
      values: { far: 120, bonus: 0.3, crit: 0, range: 250, mark: 0, markTime: 0, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "Far hits are stronger.",
      values: { far: 120, bonus: 0.5, crit: 0, range: 250, mark: 0, markTime: 0, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "Far hits crit more often.",
      values: { far: 120, bonus: 0.5, crit: 0.2, range: 250, mark: 0, markTime: 0, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "Bolts fly farther.",
      values: { far: 120, bonus: 0.5, crit: 0.2, range: 320, mark: 0, markTime: 0, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "Far hits mark the foe.",
      values: { far: 120, bonus: 0.5, crit: 0.2, range: 320, mark: 0.15, markTime: 3, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "Far hits are much stronger.",
      values: { far: 120, bonus: 1.2, crit: 0.2, range: 320, mark: 0.15, markTime: 3, refund: 0, sweet: 0, split: 0 },
    },
    {
      text: "A far kill puts the bolt back in the quiver.",
      values: { far: 120, bonus: 1.2, crit: 0.2, range: 320, mark: 0.15, markTime: 3, refund: 1, sweet: 0, split: 0 },
    },
    {
      text: "Far hits are far stronger, and the end of the flight always crits.",
      values: { far: 120, bonus: 2.5, crit: 0.2, range: 320, mark: 0.3, markTime: 3, refund: 1, sweet: 1, split: 0 },
    },
  ],
  evolution: {
    partner: "s_ricochet",
    name: "Horizon Shot",
    text: "Bolts fly twice as far, every far hit crits and splits into two bolts that seek other foes.",
    row: {
      text: "Far hits crit and split.",
      values: { far: 120, bonus: 2.5, crit: 1, range: 640, mark: 0.3, markTime: 3, refund: 1, sweet: 1, split: 2 },
    },
  },
};
