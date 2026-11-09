import type { SkillDef } from "../../../../types/skill";

/** Changeling Step. Design: docs/skills/wenna.md. Values: range: pixels Swap reaches for a Wick (160 in the base kit); flare: share more the arriving Wick's flare deals; charges: Swaps she can make before the cooldown; untouch: seconds she cannot be hit after arriving; line: attack damage foes on the line between the two ends take; dodge: seconds after the press a blow counts as a perfect dodge; heal: 1 the swapped Wick heals to full; mirror: 1 every Swap also lights a free Wick where she arrives, if under the cap (evolution) */
export const CHANGELING_STEP: SkillDef = {
  id: "w_swap",
  name: "Changeling Step",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Swap reaches further, and the Wick she trades with arrives burning.",
  levels: [
    {
      text: "Swap reaches 220 px; the flare deals 50% more.",
      values: { range: 220, flare: 0.5, charges: 1, untouch: 0.15, line: 0, dodge: 0.1, heal: 0, mirror: 0 },
    },
    {
      text: "A second Swap charge.",
      values: { range: 220, flare: 0.5, charges: 2, untouch: 0.15, line: 0, dodge: 0.1, heal: 0, mirror: 0 },
    },
    {
      text: "The flare deals 80% more.",
      values: { range: 220, flare: 0.8, charges: 2, untouch: 0.15, line: 0, dodge: 0.1, heal: 0, mirror: 0 },
    },
    {
      text: "Untouchable 0.3 s after a Swap.",
      values: { range: 220, flare: 0.8, charges: 2, untouch: 0.3, line: 0, dodge: 0.1, heal: 0, mirror: 0 },
    },
    {
      text: "Foes on the line between take 0.6x.",
      values: { range: 220, flare: 0.8, charges: 2, untouch: 0.3, line: 0.6, dodge: 0.1, heal: 0, mirror: 0 },
    },
    {
      text: "The perfect dodge window is 0.2 s.",
      values: { range: 220, flare: 0.8, charges: 2, untouch: 0.3, line: 0.6, dodge: 0.2, heal: 0, mirror: 0 },
    },
    {
      text: "The swapped Wick heals to full.",
      values: { range: 220, flare: 0.8, charges: 2, untouch: 0.3, line: 0.6, dodge: 0.2, heal: 1, mirror: 0 },
    },
    {
      text: "The flare deals 150% more.",
      values: { range: 220, flare: 1.5, charges: 2, untouch: 0.3, line: 0.6, dodge: 0.2, heal: 1, mirror: 0 },
    },
  ],
  evolution: {
    partner: "w_procession",
    name: "Mirror Wick",
    text: "Every Swap also lights a free Wick where she arrives, if she is under the cap.",
    row: {
      text: "Each Swap lights a free Wick.",
      values: { range: 220, flare: 1.5, charges: 2, untouch: 0.3, line: 0.6, dodge: 0.2, heal: 1, mirror: 1 },
    },
  },
};
