import type { SkillDef } from "../../../../types/skill";

/** Wick Hop. Design: docs/skills/wenna.md. Values: hops: hops off a Wick's head per airtime; flare: ability power the hopped Wick flares for (0: no flare); rise: pixels a hop rises; drop: share more Lamp Drop deals after a hop; stair: 1 no hop limit while over Wicks, and each hop makes that Wick bite (evolution) */
export const WICK_HOP: SkillDef = {
  id: "w_hop",
  name: "Wick Hop",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "In the air above a Wick, jump again off its head.",
  levels: [
    { text: "Above a Wick, jump again off its head.", values: { hops: 1, flare: 0, rise: 40, drop: 0, stair: 0 } },
    { text: "The hopped Wick flares for 0.6x.", values: { hops: 1, flare: 0.6, rise: 40, drop: 0, stair: 0 } },
    { text: "Two hops per airtime.", values: { hops: 2, flare: 0.6, rise: 40, drop: 0, stair: 0 } },
    { text: "Hops rise 52 px.", values: { hops: 2, flare: 0.6, rise: 52, drop: 0, stair: 0 } },
    { text: "Lamp Drop after a hop deals 30% more.", values: { hops: 2, flare: 0.6, rise: 52, drop: 0.3, stair: 0 } },
    { text: "The hopped Wick flares for 0.9x.", values: { hops: 2, flare: 0.9, rise: 52, drop: 0.3, stair: 0 } },
    { text: "Lamp Drop after a hop deals 60% more.", values: { hops: 2, flare: 0.9, rise: 52, drop: 0.6, stair: 0 } },
    { text: "The hopped Wick flares for 1.4x.", values: { hops: 2, flare: 1.4, rise: 52, drop: 0.6, stair: 0 } },
  ],
  evolution: {
    partner: "w_fangs",
    name: "Candle Stair",
    text: "No hop limit while over Wicks, and each hop makes that Wick bite.",
    row: { text: "Endless hops; each Wick bites.", values: { hops: 2, flare: 1.4, rise: 52, drop: 0.6, stair: 1 } },
  },
};
