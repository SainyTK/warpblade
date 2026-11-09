import type { SkillDef } from "../../../../types/skill";

/** Great Toll. Design: docs/skills/mirel.md. Values: power: share more Toll deals; ring: pixels Toll's ring grows; launch: 1 Toll launches minions; sand: Sand Toll gives for each foe it hits; guard: 1 Toll breaks guards; field: 1 Toll also rings at the centre of her Stillfield; midnight: 1 Toll rings twelve times over 1.2 s, 0.4x of Toll each and the twelfth 3x (evolution) */
export const GREAT_TOLL: SkillDef = {
  id: "m_toll",
  name: "Great Toll",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Toll, the third blow of her string, rings harder and wider.",
  levels: [
    {
      text: "Toll deals 25% more; its ring grows 6 px.",
      values: { power: 0.25, ring: 6, launch: 0, sand: 0, guard: 0, field: 0, midnight: 0 },
    },
    {
      text: "Toll launches minions.",
      values: { power: 0.25, ring: 6, launch: 1, sand: 0, guard: 0, field: 0, midnight: 0 },
    },
    {
      text: "Toll deals 60% more.",
      values: { power: 0.6, ring: 6, launch: 1, sand: 0, guard: 0, field: 0, midnight: 0 },
    },
    {
      text: "Toll gives 5 Sand for each foe hit.",
      values: { power: 0.6, ring: 6, launch: 1, sand: 5, guard: 0, field: 0, midnight: 0 },
    },
    {
      text: "Toll breaks guards.",
      values: { power: 0.6, ring: 6, launch: 1, sand: 5, guard: 1, field: 0, midnight: 0 },
    },
    {
      text: "Toll deals 100% more.",
      values: { power: 1, ring: 6, launch: 1, sand: 5, guard: 1, field: 0, midnight: 0 },
    },
    {
      text: "Toll also rings at your Stillfield.",
      values: { power: 1, ring: 6, launch: 1, sand: 5, guard: 1, field: 1, midnight: 0 },
    },
    {
      text: "Toll deals 180% more; its ring grows 10 px.",
      values: { power: 1.8, ring: 10, launch: 1, sand: 5, guard: 1, field: 1, midnight: 0 },
    },
  ],
  evolution: {
    partner: "m_handsweep",
    name: "Midnight",
    text: "Toll rings twelve times over 1.2 s, each for 0.4x, and the twelfth for 3x.",
    row: {
      text: "Toll rings twelve times.",
      values: { power: 1.8, ring: 10, launch: 1, sand: 5, guard: 1, field: 1, midnight: 1 },
    },
  },
};
