import type { SkillDef } from "../../../../types/skill";

/** Titan Throw. Design: docs/skills/hulda.md. Values: reach: pixels the tethers reach; fliers: 1 drags fliers down too; big: 1 drags minis and bosses to the landing; burst: share of the level's power the landing deals; path: share foes in the heap's path take; bounce: 1 bursts a second time; cooldown: seconds before the next; scatter: 1 the heap scatters into thrown bodies; swing: 1 swings the heap round first (evolution) */
export const TITAN_THROW: SkillDef = {
  id: "h_titanThrow",
  name: "Titan Throw",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: "Replaces Quake Drop: tethers drag minions into a heap in your arms, and you hurl it. Hold U to charge up to four levels.",
  ultimate: "titanThrow",
  levels: [
    {
      text: "Heap the minions and hurl them.",
      values: { reach: 80, fliers: 0, big: 0, burst: 1, path: 0.6, bounce: 0, cooldown: 20, scatter: 0, swing: 0 },
    },
    {
      text: "Tethers catch fliers.",
      values: { reach: 80, fliers: 1, big: 0, burst: 1, path: 0.6, bounce: 0, cooldown: 20, scatter: 0, swing: 0 },
    },
    {
      text: "Big foes are dragged to the landing.",
      values: { reach: 80, fliers: 1, big: 1, burst: 1, path: 0.6, bounce: 0, cooldown: 20, scatter: 0, swing: 0 },
    },
    {
      text: "Bigger burst, longer tethers.",
      values: { reach: 120, fliers: 1, big: 1, burst: 1.3, path: 0.6, bounce: 0, cooldown: 20, scatter: 0, swing: 0 },
    },
    {
      text: "The heap bursts twice.",
      values: { reach: 120, fliers: 1, big: 1, burst: 1.3, path: 0.6, bounce: 1, cooldown: 20, scatter: 0, swing: 0 },
    },
    {
      text: "Faster recharge.",
      values: { reach: 120, fliers: 1, big: 1, burst: 1.3, path: 0.6, bounce: 1, cooldown: 16, scatter: 0, swing: 0 },
    },
    {
      text: "The heap scatters.",
      values: { reach: 120, fliers: 1, big: 1, burst: 1.3, path: 0.6, bounce: 1, cooldown: 16, scatter: 1, swing: 0 },
    },
    {
      text: "Burst far harder.",
      values: { reach: 120, fliers: 1, big: 1, burst: 5, path: 1.5, bounce: 1, cooldown: 16, scatter: 1, swing: 0 },
    },
  ],
  evolution: {
    partner: "h_giantSwing",
    name: "Mountain Hurl",
    text: "You swing the heap round twice first, striking everything near, then hurl it wall to wall.",
    row: {
      text: "Swing the heap, then hurl it wall to wall.",
      values: { reach: 160, fliers: 1, big: 1, burst: 9, path: 1.5, bounce: 1, cooldown: 16, scatter: 1, swing: 1 },
    },
  },
};
