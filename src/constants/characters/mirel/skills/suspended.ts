import type { SkillDef } from "../../../../types/skill";

/** Suspended. Design: docs/skills/mirel.md. Values: time: seconds of hover per airtime; cost: share less stamina the hover spends; drift: air drift in px/s while hovering; hovers: hovers per airtime; slow: share foes under her are slowed; free: 1 the hover costs no stamina while over a foe; grind: attack damage a second of grinding sand on foes below, and at 50+ Sand the hover has no limit (evolution) */
export const SUSPENDED: SkillDef = {
  id: "m_suspend",
  name: "Suspended",
  kind: "movement",
  risk: "easy",
  button: "jump",
  text: "Her hover lasts longer and costs less.",
  levels: [
    {
      text: "Hover 2 s for 25% less stamina.",
      values: { time: 2, cost: 0.25, drift: 60, hovers: 1, slow: 0, free: 0, grind: 0 },
    },
    {
      text: "Drift 80 px/s while hovering.",
      values: { time: 2, cost: 0.25, drift: 80, hovers: 1, slow: 0, free: 0, grind: 0 },
    },
    {
      text: "A second hover per airtime.",
      values: { time: 2, cost: 0.25, drift: 80, hovers: 2, slow: 0, free: 0, grind: 0 },
    },
    {
      text: "The hover costs 40% less stamina.",
      values: { time: 2, cost: 0.4, drift: 80, hovers: 2, slow: 0, free: 0, grind: 0 },
    },
    {
      text: "Foes under you are slowed 30%.",
      values: { time: 2, cost: 0.4, drift: 80, hovers: 2, slow: 0.3, free: 0, grind: 0 },
    },
    { text: "Hover 3 s.", values: { time: 3, cost: 0.4, drift: 80, hovers: 2, slow: 0.3, free: 0, grind: 0 } },
    {
      text: "No stamina cost while over a foe.",
      values: { time: 3, cost: 0.4, drift: 80, hovers: 2, slow: 0.3, free: 1, grind: 0 },
    },
    {
      text: "60% less stamina; foes below slowed 45%.",
      values: { time: 3, cost: 0.6, drift: 80, hovers: 2, slow: 0.45, free: 1, grind: 0 },
    },
  ],
  evolution: {
    partner: "m_sandstorm",
    name: "Hanging Hour",
    text: "At 50 Sand or more the hover has no limit and drops grinding sand on foes below for 0.4x a second.",
    row: {
      text: "Endless hover at 50+ Sand; grinding sand.",
      values: { time: 3, cost: 0.6, drift: 80, hovers: 2, slow: 0.45, free: 1, grind: 0.4 },
    },
  },
};
