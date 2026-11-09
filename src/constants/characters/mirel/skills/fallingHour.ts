import type { SkillDef } from "../../../../types/skill";

/** Falling Hour. Design: docs/skills/mirel.md. Values: power: attack damage in the dive's ring; ring: its radius; hover: share more the dive deals out of a hover; refresh: 1 the dive gives the hover back; launch: 1 foes in the ring are launched; echo: 1 the dive's ring echoes; field: seconds a free Stillfield stands where the dive lands (evolution) */
export const FALLING_HOUR: SkillDef = {
  id: "m_fallinghour",
  name: "Falling Hour",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Pendant Strike becomes a dive that strikes a ring where she lands.",
  levels: [
    {
      text: "Pendant Strike dives for 1.1x in 24 px.",
      values: { power: 1.1, ring: 24, hover: 0, refresh: 0, launch: 0, echo: 0, field: 0 },
    },
    {
      text: "A dive from a hover deals 40% more.",
      values: { power: 1.1, ring: 24, hover: 0.4, refresh: 0, launch: 0, echo: 0, field: 0 },
    },
    {
      text: "The ring reaches 34 px.",
      values: { power: 1.1, ring: 34, hover: 0.4, refresh: 0, launch: 0, echo: 0, field: 0 },
    },
    {
      text: "The dive deals 1.8x.",
      values: { power: 1.8, ring: 34, hover: 0.4, refresh: 0, launch: 0, echo: 0, field: 0 },
    },
    {
      text: "The dive gives the hover back.",
      values: { power: 1.8, ring: 34, hover: 0.4, refresh: 1, launch: 0, echo: 0, field: 0 },
    },
    {
      text: "Foes in the ring are launched.",
      values: { power: 1.8, ring: 34, hover: 0.4, refresh: 1, launch: 1, echo: 0, field: 0 },
    },
    {
      text: "The dive's ring echoes.",
      values: { power: 1.8, ring: 34, hover: 0.4, refresh: 1, launch: 1, echo: 1, field: 0 },
    },
    {
      text: "The dive deals 3.2x.",
      values: { power: 3.2, ring: 34, hover: 0.4, refresh: 1, launch: 1, echo: 1, field: 0 },
    },
  ],
  evolution: {
    partner: "m_suspend",
    name: "Sky Clock",
    text: "The dive opens a free Stillfield for 1.5 s where it lands.",
    row: {
      text: "The dive opens a free field for 1.5 s.",
      values: { power: 3.2, ring: 34, hover: 0.4, refresh: 1, launch: 1, echo: 1, field: 1.5 },
    },
  },
};
