import type { SkillDef } from "../../../../types/skill";

/** Ricochet: Bolts bounce on to the next foe; best near walls and in packs. Values: chain: times a bolt that hits bounces on to another foe; share: a bounced bolt's damage; reach: pixels to the next foe; wall: bounces off the floor and the stage edge; killOn: a killing bolt flies on; stagger: seconds a bounce staggers; edgePrime: a bolt off the edge comes back primed; perBounce: damage added per bounce; split: each bounce splits in two. Design: docs/skills/sable.md */
export const RICOCHET: SkillDef = {
  id: "s_ricochet",
  name: "Ricochet",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Bolts bounce on to the next foe; best near walls and in packs.",
  levels: [
    { text: "A bolt that hits bounces to a nearby foe.", values: { chain: 1, share: 0.7, reach: 80, wall: 0, killOn: 0, stagger: 0, edgePrime: 0, perBounce: 0, split: 0 } },
    { text: "Bolts bounce off the floor and the edge.", values: { chain: 1, share: 0.7, reach: 80, wall: 1, killOn: 0, stagger: 0, edgePrime: 0, perBounce: 0, split: 0 } },
    { text: "A bolt that kills flies on.", values: { chain: 1, share: 0.7, reach: 80, wall: 1, killOn: 1, stagger: 0, edgePrime: 0, perBounce: 0, split: 0 } },
    { text: "Bolts bounce one more time.", values: { chain: 2, share: 0.7, reach: 80, wall: 1, killOn: 1, stagger: 0, edgePrime: 0, perBounce: 0, split: 0 } },
    { text: "Bounced bolts hit harder and stagger.", values: { chain: 2, share: 0.8, reach: 80, wall: 1, killOn: 1, stagger: 0.25, edgePrime: 0, perBounce: 0, split: 0 } },
    { text: "A bolt off the edge comes back primed.", values: { chain: 2, share: 0.8, reach: 80, wall: 1, killOn: 1, stagger: 0.25, edgePrime: 1, perBounce: 0, split: 0 } },
    { text: "Bolts bounce farther, four times.", values: { chain: 4, share: 0.8, reach: 120, wall: 1, killOn: 1, stagger: 0.25, edgePrime: 1, perBounce: 0, split: 0 } },
    { text: "Each bounce makes the bolt 30% stronger.", values: { chain: 4, share: 0.8, reach: 120, wall: 1, killOn: 1, stagger: 0.25, edgePrime: 1, perBounce: 0.3, split: 0 } },
  ],
  evolution: {
    partner: "s_scatter",
    name: "Splinter Storm",
    text: "Each bounce splits the bolt in two, up to eight bolts from one shot.",
    row: { text: "Bounces split the bolt in two.", values: { chain: 4, share: 0.8, reach: 120, wall: 1, killOn: 1, stagger: 0.25, edgePrime: 1, perBounce: 0.3, split: 8 } },
  },
};
