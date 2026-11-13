import type { SkillDef } from "../../../../types/skill";

/** Guttering. Design: docs/skills/wenna.md. Values: power: ability power of the burst when a Wick dies or burns out; radius: the burst's radius; launch: 1 the burst launches minions; wax: Wax each burst leaves; chill: 1 the burst chills; wildfire: 1 the burst leaves a 2 s fire on the floor (evolution) */
export const GUTTERING: SkillDef = {
  id: "w_gutter",
  name: "Guttering",
  kind: "attack",
  risk: "timed",
  button: "auto",
  text: "A Wick that dies or burns out bursts.",
  levels: [
    {
      text: "An ending Wick bursts for 0.4x in 24 px.",
      values: { power: 0.4, radius: 24, launch: 0, wax: 0, chill: 0, wildfire: 0 },
    },
    { text: "The burst reaches 32 px.", values: { power: 0.4, radius: 32, launch: 0, wax: 0, chill: 0, wildfire: 0 } },
    {
      text: "The burst launches minions.",
      values: { power: 0.4, radius: 32, launch: 1, wax: 0, chill: 0, wildfire: 0 },
    },
    { text: "The burst deals 0.8x.", values: { power: 0.8, radius: 32, launch: 1, wax: 0, chill: 0, wildfire: 0 } },
    { text: "Each burst leaves 5 Wax.", values: { power: 0.8, radius: 32, launch: 1, wax: 5, chill: 0, wildfire: 0 } },
    { text: "The burst chills.", values: { power: 0.8, radius: 32, launch: 1, wax: 5, chill: 1, wildfire: 0 } },
    { text: "The burst deals 1.2x.", values: { power: 1.2, radius: 32, launch: 1, wax: 5, chill: 1, wildfire: 0 } },
    { text: "The burst deals 1.6x.", values: { power: 1.6, radius: 32, launch: 1, wax: 5, chill: 1, wildfire: 0 } },
  ],
  evolution: {
    partner: "w_kindle",
    name: "Wildfire",
    text: "Bursts deal 2.5x and leave a fire on the floor for 2 s.",
    row: {
      text: "Bursts deal 2.5x and leave a 2 s fire.",
      values: { power: 2.5, radius: 32, launch: 1, wax: 5, chill: 1, wildfire: 1 },
    },
  },
};
