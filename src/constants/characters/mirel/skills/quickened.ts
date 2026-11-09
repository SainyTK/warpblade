import type { SkillDef } from "../../../../types/skill";

/** Quickened. Design: docs/skills/mirel.md. Values: speed: share more move and attack speed after a Rewind; life: seconds it lasts; refill: share faster Sand refills while it lasts (1 is double); sooner: seconds sooner her echoes land while it lasts; overclock: 1 while Quickened every echo lands at once at full power (evolution) */
export const QUICKENED: SkillDef = {
  id: "m_quicken",
  name: "Quickened",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "After a Rewind she moves and attacks faster for a while.",
  levels: [
    {
      text: "After a Rewind: 15% faster for 2 s.",
      values: { speed: 0.15, life: 2, refill: 0, sooner: 0, overclock: 0 },
    },
    { text: "Quickened lasts 3 s.", values: { speed: 0.15, life: 3, refill: 0, sooner: 0, overclock: 0 } },
    { text: "25% faster.", values: { speed: 0.25, life: 3, refill: 0, sooner: 0, overclock: 0 } },
    {
      text: "Sand refills double while Quickened.",
      values: { speed: 0.25, life: 3, refill: 1, sooner: 0, overclock: 0 },
    },
    { text: "Echoes land 0.2 s sooner.", values: { speed: 0.25, life: 3, refill: 1, sooner: 0.2, overclock: 0 } },
    { text: "35% faster.", values: { speed: 0.35, life: 3, refill: 1, sooner: 0.2, overclock: 0 } },
    { text: "Quickened lasts 4 s.", values: { speed: 0.35, life: 4, refill: 1, sooner: 0.2, overclock: 0 } },
    { text: "50% faster.", values: { speed: 0.5, life: 4, refill: 1, sooner: 0.2, overclock: 0 } },
  ],
  evolution: {
    partner: "m_echo",
    name: "Overclock",
    text: "While Quickened every echo lands at once at full power.",
    row: {
      text: "Quickened echoes land at once, at full.",
      values: { speed: 0.5, life: 4, refill: 1, sooner: 0.2, overclock: 1 },
    },
  },
};
