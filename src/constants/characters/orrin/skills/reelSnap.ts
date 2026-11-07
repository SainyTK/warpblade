import type { SkillDef } from "../../../../types/skill";

/** Reel Snap. Design: docs/skills/orrin.md. Values: power: attack damage of the snap; at: share of the reel's starting speed it must reach; reel: reel speed in px/s; radius: the snap's reach; stun: seconds it stuns; arc: 1 the snap gives the Hanging Arc back; shock: 1 a snap at the bottom of the arc sends a shock along the floor; whiplash: 1 every snap is a Full Circle at the swing point (evolution) */
export const REEL_SNAP: SkillDef = {
  id: "o_reelsnap",
  name: "Reel Snap",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "A reel that speeds you up enough snaps the chain at foes near you.",
  levels: [
    {
      text: "A fast reel snaps 0.8x at foes within 30 px.",
      values: { power: 0.8, at: 1.3, reel: 160, radius: 30, stun: 0, arc: 0, shock: 0, whiplash: 0 },
    },
    {
      text: "Reel at 220 px/s.",
      values: { power: 0.8, at: 1.3, reel: 220, radius: 30, stun: 0, arc: 0, shock: 0, whiplash: 0 },
    },
    {
      text: "The snap stuns for 0.4 s.",
      values: { power: 0.8, at: 1.3, reel: 220, radius: 30, stun: 0.4, arc: 0, shock: 0, whiplash: 0 },
    },
    {
      text: "The snap gives the Hanging Arc back.",
      values: { power: 0.8, at: 1.3, reel: 220, radius: 30, stun: 0.4, arc: 1, shock: 0, whiplash: 0 },
    },
    {
      text: "The snap reaches 44 px and deals 1.2x.",
      values: { power: 1.2, at: 1.3, reel: 220, radius: 44, stun: 0.4, arc: 1, shock: 0, whiplash: 0 },
    },
    {
      text: "A snap low in the arc shocks the floor.",
      values: { power: 1.2, at: 1.3, reel: 220, radius: 44, stun: 0.4, arc: 1, shock: 1, whiplash: 0 },
    },
    {
      text: "The snap deals 1.6x.",
      values: { power: 1.6, at: 1.3, reel: 220, radius: 44, stun: 0.4, arc: 1, shock: 1, whiplash: 0 },
    },
    {
      text: "The snap deals 2.2x.",
      values: { power: 2.2, at: 1.3, reel: 220, radius: 44, stun: 0.4, arc: 1, shock: 1, whiplash: 0 },
    },
  ],
  evolution: {
    partner: "o_ironweight",
    name: "Whiplash",
    text: "Every snap is a Full Circle round the swing point.",
    row: {
      text: "Every snap is a Full Circle.",
      values: { power: 2.2, at: 1.3, reel: 220, radius: 44, stun: 0.4, arc: 1, shock: 1, whiplash: 1 },
    },
  },
};
