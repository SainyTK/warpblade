import type { SkillDef } from "../../../../types/skill";

/** Maelstrom. Design: docs/skills/orrin.md. Values: turns: full turns; radius: the circle's radius; power: share of the level's power each foe takes a turn; pull: 1 foes in the circle are pulled to its middle; shards: 1 chain shards fly out each turn; crash: share of the level's power of the crash ring at the end; burst: share of the level's power the foes pulled in burst for together (evolution) */
export const MAELSTROM: SkillDef = {
  id: "o_maelstrom",
  name: "Maelstrom",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Grand Pendulum: full vertical turns round a rift tear that strike every foe in the circle.",
  ultimate: "maelstrom",
  levels: [
    { text: "Two turns, 0.6x the level's power each.", values: { turns: 2, radius: 96, power: 0.6, pull: 0, shards: 0, crash: 0, burst: 0 } },
    { text: "Three turns.", values: { turns: 3, radius: 96, power: 0.6, pull: 0, shards: 0, crash: 0, burst: 0 } },
    { text: "Foes are pulled to the middle.", values: { turns: 3, radius: 96, power: 0.6, pull: 1, shards: 0, crash: 0, burst: 0 } },
    { text: "The circle grows to radius 120.", values: { turns: 3, radius: 120, power: 0.6, pull: 1, shards: 0, crash: 0, burst: 0 } },
    { text: "Chain shards fly out each turn.", values: { turns: 3, radius: 120, power: 0.6, pull: 1, shards: 1, crash: 0, burst: 0 } },
    { text: "Each turn deals 1.4x.", values: { turns: 3, radius: 120, power: 1.4, pull: 1, shards: 1, crash: 0, burst: 0 } },
    { text: "Four turns and a crash ring.", values: { turns: 4, radius: 120, power: 1.4, pull: 1, shards: 1, crash: 1, burst: 0 } },
    { text: "Each turn 2.5x, the crash 2x.", values: { turns: 4, radius: 120, power: 2.5, pull: 1, shards: 1, crash: 2, burst: 0 } },
  ],
  evolution: {
    partner: "o_pump",
    name: "Eye of the Maelstrom",
    text: "Five turns in a circle as tall as the screen, and the foes pulled into its middle burst together at the end.",
    row: { text: "Five turns, a giant circle, a final burst.", values: { turns: 5, radius: 150, power: 3, pull: 1, shards: 1, crash: 0, burst: 15 } },
  },
};
