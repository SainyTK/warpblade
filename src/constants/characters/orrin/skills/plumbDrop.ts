import type { SkillDef } from "../../../../types/skill";

/** Plumb Drop. Design: docs/skills/orrin.md. Values: power: attack damage in the ring; ring: its radius; launch: 1 foes in it are launched; momentum: 1 Momentum adds up to +50% to the drop; head: 1 a drop on a foe's head crits; hook: 1 a drop gives a hook back; quake: the evolved quake's radius; root: seconds it roots (evolution) */
export const PLUMB_DROP: SkillDef = {
  id: "o_plumbdrop",
  name: "Plumb Drop",
  kind: "movement",
  risk: "precise",
  button: "J",
  text: "Hold Down while swinging to let go and drop straight down onto foes.",
  levels: [
    {
      text: "Down in a swing drops for 1.2x in 28 px.",
      values: { power: 1.2, ring: 28, launch: 0, momentum: 0, head: 0, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "The drop's ring reaches 40 px.",
      values: { power: 1.2, ring: 40, launch: 0, momentum: 0, head: 0, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "Foes in the ring are launched.",
      values: { power: 1.2, ring: 40, launch: 1, momentum: 0, head: 0, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "The drop deals 1.8x.",
      values: { power: 1.8, ring: 40, launch: 1, momentum: 0, head: 0, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "Momentum adds to the drop's damage.",
      values: { power: 1.8, ring: 40, launch: 1, momentum: 1, head: 0, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "A drop on a foe's head crits.",
      values: { power: 1.8, ring: 40, launch: 1, momentum: 1, head: 1, hook: 0, quake: 0, root: 0 },
    },
    {
      text: "A drop gives a hook back.",
      values: { power: 1.8, ring: 40, launch: 1, momentum: 1, head: 1, hook: 1, quake: 0, root: 0 },
    },
    {
      text: "The drop deals 3.0x.",
      values: { power: 3, ring: 40, launch: 1, momentum: 1, head: 1, hook: 1, quake: 0, root: 0 },
    },
  ],
  evolution: {
    partner: "o_gaff",
    name: "Meteor Anchor",
    text: "The drop drives the hook into the floor for a 64 px quake that roots foes for 1 s.",
    row: {
      text: "A 64 px quake that roots for 1 s.",
      values: { power: 3.5, ring: 40, launch: 1, momentum: 1, head: 1, hook: 1, quake: 64, root: 1 },
    },
  },
};
