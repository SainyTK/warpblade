import type { SkillDef } from "../../../../types/skill";

/** Open Shutter. Design: docs/skills/wenna.md. Values: power: share more the Flare deals; cone: pixels added to the far edge of the Flare's cone (46 in the base kit); ignite: 1 the Flare ignites the foes it hits (the shared burn); wick: 1 a kill by the Flare lights a free Wick; echo: share of the Flare each Wick within 100 px repeats from where it stands; beam: 1 the Flare becomes a 160 px beam and every Wick fires one too (evolution) */
export const OPEN_SHUTTER: SkillDef = {
  id: "w_flare",
  name: "Open Shutter",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Flare, the third blow of her string, burns harder and further.",
  levels: [
    {
      text: "The Flare deals 30% more; its cone grows 8 px.",
      values: { power: 0.3, cone: 8, ignite: 0, wick: 0, echo: 0, beam: 0 },
    },
    { text: "The Flare ignites.", values: { power: 0.3, cone: 8, ignite: 1, wick: 0, echo: 0, beam: 0 } },
    { text: "The Flare deals 45% more.", values: { power: 0.45, cone: 8, ignite: 1, wick: 0, echo: 0, beam: 0 } },
    {
      text: "A kill by the Flare lights a free Wick.",
      values: { power: 0.45, cone: 8, ignite: 1, wick: 1, echo: 0, beam: 0 },
    },
    { text: "The cone reaches 60 px.", values: { power: 0.45, cone: 14, ignite: 1, wick: 1, echo: 0, beam: 0 } },
    {
      text: "Wicks within 100 px repeat the Flare at 0.4x.",
      values: { power: 0.45, cone: 14, ignite: 1, wick: 1, echo: 0.4, beam: 0 },
    },
    { text: "The Flare deals 60% more.", values: { power: 0.6, cone: 14, ignite: 1, wick: 1, echo: 0.4, beam: 0 } },
    { text: "The Flare deals 80% more.", values: { power: 0.8, cone: 14, ignite: 1, wick: 1, echo: 0.4, beam: 0 } },
  ],
  evolution: {
    partner: "w_lampVolley",
    name: "Lighthouse",
    text: "The Flare becomes a 160 px beam, and every Wick fires one too.",
    row: {
      text: "A 160 px beam from you and every Wick.",
      values: { power: 0.8, cone: 14, ignite: 1, wick: 1, echo: 0.4, beam: 1 },
    },
  },
};
