import type { SkillDef } from "../../../../types/skill";

/** Anchor Fall. Design: docs/skills/orrin.md. Values: mp, cooldown; power: ability power in the ring; ring: its radius; stun: seconds; count: anchors; root: seconds the chain between anchors roots; pull: pixels foes are pulled in first; rain: 1 five anchors fall across the screen (evolution) */
export const ANCHOR_FALL: SkillDef = {
  id: "o_anchorfall",
  name: "Anchor Fall",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "An iron anchor drops from a rift onto the foes ahead.",
  levels: [
    {
      text: "An anchor falls 50 px ahead for 3.0x.",
      values: { mp: 26, cooldown: 7, power: 3, ring: 26, stun: 0.6, count: 1, root: 0, pull: 0, rain: 0 },
    },
    {
      text: "A second anchor 30 px further.",
      values: { mp: 26, cooldown: 7, power: 3, ring: 26, stun: 0.6, count: 2, root: 0, pull: 0, rain: 0 },
    },
    {
      text: "The chain between anchors roots for 0.8 s.",
      values: { mp: 26, cooldown: 7, power: 3, ring: 26, stun: 0.6, count: 2, root: 0.8, pull: 0, rain: 0 },
    },
    {
      text: "The ring reaches 36 px.",
      values: { mp: 26, cooldown: 7, power: 3, ring: 36, stun: 0.6, count: 2, root: 0.8, pull: 0, rain: 0 },
    },
    {
      text: "The drop pulls foes in first.",
      values: { mp: 26, cooldown: 7, power: 3, ring: 36, stun: 0.6, count: 2, root: 0.8, pull: 20, rain: 0 },
    },
    {
      text: "Anchors deal 4.2x.",
      values: { mp: 26, cooldown: 7, power: 4.2, ring: 36, stun: 0.6, count: 2, root: 0.8, pull: 20, rain: 0 },
    },
    {
      text: "Three anchors.",
      values: { mp: 26, cooldown: 7, power: 4.2, ring: 36, stun: 0.6, count: 3, root: 0.8, pull: 20, rain: 0 },
    },
    {
      text: "Anchors deal 5.5x.",
      values: { mp: 26, cooldown: 7, power: 5.5, ring: 36, stun: 0.6, count: 3, root: 0.8, pull: 20, rain: 0 },
    },
  ],
  evolution: {
    partner: "o_tether",
    name: "Iron Rain",
    text: "Five anchors fall across the screen, each for 6x.",
    row: {
      text: "Five anchors across the screen, 6x each.",
      values: { mp: 26, cooldown: 7, power: 6, ring: 36, stun: 0.6, count: 5, root: 0.8, pull: 20, rain: 1 },
    },
  },
};
