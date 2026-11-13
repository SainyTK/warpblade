import type { SkillDef } from "../../../../types/skill";

/** Slide Kick: The slide (I held on the hop) trips foes into the air and she rises facing them. Values: power: attack damage to each foe slid through; trip: seconds; launch: foes are thrown up this hard; time: the slide's seconds; turn: she rises facing the foes she passed; charged: bolts primed after a slide; refund: foes a slide must pass to give the hop back and load bolts; tangle: seconds thrown foes hang in a net. Design: docs/skills/sable.md */
export const SLIDE_KICK: SkillDef = {
  id: "s_slideKick",
  name: "Slide Kick",
  kind: "movement",
  risk: "timed",
  button: "I",
  text: "The slide trips foes into the air and she rises facing them.",
  levels: [
    {
      text: "The slide trips every foe it passes.",
      values: { power: 1, trip: 0.9, launch: 0, time: 0.3, turn: 0, charged: 0, refund: 0, tangle: 0 },
    },
    {
      text: "Tripped foes fly into the air.",
      values: { power: 1, trip: 0.9, launch: 160, time: 0.3, turn: 0, charged: 0, refund: 0, tangle: 0 },
    },
    {
      text: "A longer slide.",
      values: { power: 1, trip: 0.9, launch: 160, time: 0.4, turn: 0, charged: 0, refund: 0, tangle: 0 },
    },
    {
      text: "You rise facing the foes you slid under.",
      values: { power: 1, trip: 0.9, launch: 160, time: 0.4, turn: 1, charged: 0, refund: 0, tangle: 0 },
    },
    {
      text: "The slide hits harder.",
      values: { power: 2.5, trip: 0.9, launch: 160, time: 0.4, turn: 1, charged: 0, refund: 0, tangle: 0 },
    },
    {
      text: "Your next 3 bolts after a slide are primed.",
      values: { power: 2.5, trip: 0.9, launch: 160, time: 0.4, turn: 1, charged: 3, refund: 0, tangle: 0 },
    },
    {
      text: "A slide through a crowd gives the hop back and loads bolts.",
      values: { power: 2.5, trip: 0.9, launch: 160, time: 0.4, turn: 1, charged: 3, refund: 3, tangle: 0 },
    },
    {
      text: "Tripped foes take much more and fly higher.",
      values: { power: 3.5, trip: 0.9, launch: 220, time: 0.4, turn: 1, charged: 3, refund: 3, tangle: 0 },
    },
  ],
  evolution: {
    partner: "s_net",
    name: "Tangle Slide",
    text: "Foes the slide throws hang tangled in a net in the air, taking 25% more.",
    row: {
      text: "Thrown foes hang tangled in the air.",
      values: { power: 3.5, trip: 0.9, launch: 220, time: 0.4, turn: 1, charged: 3, refund: 3, tangle: 1.5 },
    },
  },
};
