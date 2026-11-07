import type { SkillDef } from "../../../../types/skill";

/** Pendulum Pump. Design: docs/skills/orrin.md. Values: pump: share harder Left and Right pump the swing; bite: seconds an air bite holds; range: pixels more the hook flies; fling: share more a fling adds; cost: stamina less a hook costs; hooks: air hooks more per airtime; skyline: 1 at 50+ Momentum hooks are not limited per airtime (evolution); cut: attack damage the chain deals to foes it sweeps through in a swing (evolution) */
export const PENDULUM_PUMP: SkillDef = {
  id: "o_pump",
  name: "Pendulum Pump",
  kind: "movement",
  risk: "easy",
  button: "K",
  text: "Swing higher and hook further.",
  levels: [
    { text: "Pump 30% harder; air bites hold 1.6 s.", values: { pump: 0.3, bite: 1.6, range: 0, fling: 0, cost: 0, hooks: 0, skyline: 0, cut: 0 } },
    { text: "The hook flies 12 px further.", values: { pump: 0.3, bite: 1.6, range: 12, fling: 0, cost: 0, hooks: 0, skyline: 0, cut: 0 } },
    { text: "Flings carry 15% more.", values: { pump: 0.3, bite: 1.6, range: 12, fling: 0.15, cost: 0, hooks: 0, skyline: 0, cut: 0 } },
    { text: "A hook costs 4 less stamina.", values: { pump: 0.3, bite: 1.6, range: 12, fling: 0.15, cost: 4, hooks: 0, skyline: 0, cut: 0 } },
    { text: "A third hook per airtime.", values: { pump: 0.3, bite: 1.6, range: 12, fling: 0.15, cost: 4, hooks: 1, skyline: 0, cut: 0 } },
    { text: "Air bites hold 2.2 s.", values: { pump: 0.3, bite: 2.2, range: 12, fling: 0.15, cost: 4, hooks: 1, skyline: 0, cut: 0 } },
    { text: "The hook flies 24 px further.", values: { pump: 0.3, bite: 2.2, range: 24, fling: 0.15, cost: 4, hooks: 1, skyline: 0, cut: 0 } },
    { text: "Pump 60% harder, flings 30% more.", values: { pump: 0.6, bite: 2.2, range: 24, fling: 0.3, cost: 4, hooks: 1, skyline: 0, cut: 0 } },
  ],
  evolution: {
    partner: "o_friction",
    name: "Skyline",
    text: "With 50 Momentum or more hooks are not limited per airtime, and the chain cuts foes it sweeps through.",
    row: { text: "Endless hooks at 50+ Momentum; the chain cuts.", values: { pump: 0.6, bite: 2.2, range: 24, fling: 0.3, cost: 4, hooks: 1, skyline: 1, cut: 0.5 } },
  },
};
