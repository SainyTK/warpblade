import type { SkillDef } from "../../../../types/skill";

/** Undertow. Design: docs/skills/orrin.md. Values: distance: pixels Backline yanks; drag: pixels the nearest foe ahead is dragged after; slip: seconds at the start of a Backline in which a blow is a Slip; boost: share harder a hook within 0.3 s of a Backline flings; trip: seconds the chain line on the floor trips foes; power: attack damage of the trip; riptide: pixels ahead within which every foe is pulled and rooted 1 s (evolution) */
export const UNDERTOW: SkillDef = {
  id: "o_undertow",
  name: "Undertow",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Backline yanks you further and drags foes after you.",
  levels: [
    {
      text: "Backline yanks 64 px.",
      values: { distance: 64, drag: 0, slip: 0, boost: 0, trip: 0, power: 0, riptide: 0 },
    },
    {
      text: "The nearest foe ahead is dragged 20 px.",
      values: { distance: 64, drag: 20, slip: 0, boost: 0, trip: 0, power: 0, riptide: 0 },
    },
    {
      text: "A blow early in a Backline is a Slip.",
      values: { distance: 64, drag: 20, slip: 0.1, boost: 0, trip: 0, power: 0, riptide: 0 },
    },
    {
      text: "A hook just after a Backline flings 30% more.",
      values: { distance: 64, drag: 20, slip: 0.1, boost: 0.3, trip: 0, power: 0, riptide: 0 },
    },
    {
      text: "Backline yanks 72 px.",
      values: { distance: 72, drag: 20, slip: 0.1, boost: 0.3, trip: 0, power: 0, riptide: 0 },
    },
    {
      text: "A chain line on the floor trips foes.",
      values: { distance: 72, drag: 20, slip: 0.1, boost: 0.3, trip: 0.4, power: 0.3, riptide: 0 },
    },
    {
      text: "The trip deals 0.6x.",
      values: { distance: 72, drag: 20, slip: 0.1, boost: 0.3, trip: 0.4, power: 0.6, riptide: 0 },
    },
    {
      text: "The trip deals 1.0x.",
      values: { distance: 72, drag: 20, slip: 0.1, boost: 0.3, trip: 0.4, power: 1, riptide: 0 },
    },
  ],
  evolution: {
    partner: "o_anchorfall",
    name: "Riptide",
    text: "Backline pulls every foe within 60 px ahead after you and roots them for 1 s.",
    row: {
      text: "Pull every foe ahead along and root them.",
      values: { distance: 72, drag: 20, slip: 0.1, boost: 0.3, trip: 0.4, power: 1, riptide: 60 },
    },
  },
};
