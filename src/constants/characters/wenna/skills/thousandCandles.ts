import type { SkillDef } from "../../../../types/skill";

/** Thousand Candles. Design: docs/skills/wenna.md. Values: power: share of the level's power each foe in reach takes from the candles; flare: share of that hit every Wick she has flares for; great: seconds every Wick becomes a Great Wick (0: none); knock: 1 the candles knock foes up; leave: Wicks the candles leave when they melt; night: 1 the whole stage fills with candles and every foe takes the hit three times (evolution) */
export const THOUSAND_CANDLES: SkillDef = {
  id: "w_thousand",
  name: "Thousand Candles",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Great Wick: a field of candles rises across the reach, and every Wick flares with them.",
  ultimate: "thousandCandles",
  levels: [
    {
      text: "Candles rise for 1.0x; every Wick flares half.",
      values: { power: 1, flare: 0.5, great: 0, knock: 0, leave: 0, night: 0 },
    },
    { text: "The candles knock foes up.", values: { power: 1, flare: 0.5, great: 0, knock: 1, leave: 0, night: 0 } },
    { text: "The candles deal 1.4x.", values: { power: 1.4, flare: 0.5, great: 0, knock: 1, leave: 0, night: 0 } },
    {
      text: "Every Wick is a Great Wick for 3 s.",
      values: { power: 1.4, flare: 0.5, great: 3, knock: 1, leave: 0, night: 0 },
    },
    { text: "The candles deal 1.8x.", values: { power: 1.8, flare: 0.5, great: 3, knock: 1, leave: 0, night: 0 } },
    { text: "The candles leave 4 Wicks.", values: { power: 1.8, flare: 0.5, great: 3, knock: 1, leave: 4, night: 0 } },
    { text: "The candles deal 2.3x.", values: { power: 2.3, flare: 0.5, great: 3, knock: 1, leave: 4, night: 0 } },
    { text: "The candles deal 3x.", values: { power: 3, flare: 0.5, great: 3, knock: 1, leave: 4, night: 0 } },
  ],
  evolution: {
    partner: "w_tallow",
    name: "Night of Lamps",
    text: "The whole stage fills with candles, and every foe takes the hit three times.",
    row: {
      text: "Candles fill the stage; three hits.",
      values: { power: 3, flare: 0.5, great: 3, knock: 1, leave: 4, night: 1 },
    },
  },
};
