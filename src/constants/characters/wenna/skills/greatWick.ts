import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Great Wick. Design: docs/skills/wenna.md. Values: power: share of the level's power each swing of the giant deals;
 *  more: Wicks it melts into on top of the level's; candles: share of a swing's power the candles rising across the reach
 *  deal each foe (0: none); flare: share of a swing's power every Wick she has flares for (0: none); great: seconds every
 *  Wick stands as a Great Wick (0: none); swings: times the giant swings; night: 1 the candles fill the whole stage and
 *  strike every foe three times (evolution) */
const LEVELS = levelRows([
  {
    text: "The giant swings for 1.3x and melts into one more Wick.",
    values: { power: 1.3, more: 1, candles: 0, flare: 0, great: 0, swings: 1, night: 0 },
  },
  { text: "New: candles rise across the reach and strike for half.", values: { candles: 0.5 } },
  { text: "New: every Wick you have flares with it for half.", values: { flare: 0.5 } },
  { text: "The giant swings for 1.8x.", values: { power: 1.8 } },
  { text: "New: every Wick stands as a Great Wick for 3 s.", values: { great: 3 } },
  { text: "New: the giant swings back a second time.", values: { swings: 2 } },
  { text: "The giant swings for 2.2x.", values: { power: 2.2 } },
  { text: "The giant swings for 2.5x and melts into two more Wicks.", values: { power: 2.5, more: 2 } },
]);

export const GREAT_WICK_SKILL: SkillDef = {
  id: "w_greatWick",
  name: "Great Wick",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Great Wick swings harder, raises a field of candles and wakes every Wick you have.",
  levels: LEVELS,
  evolution: {
    partner: "w_tallow",
    name: "Night of Lamps",
    text: "Candles fill the whole stage and strike every foe three times.",
    row: evolvedRow(LEVELS[7], "Candles fill the stage; three strikes.", { candles: 1, night: 1 }),
  },
};
