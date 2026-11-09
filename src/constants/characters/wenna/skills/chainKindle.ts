import type { SkillDef } from "../../../../types/skill";

/** Chain Kindle. Design: docs/skills/wenna.md. Values: power: share more Kindle deals; refund: 1 Kindle refunds all of the Wick's Wax, not half; radius: pixels added to Kindle's burst (36 in the base kit); chain: share of Kindle one more Wick within 40 px bursts for (0: no chain); stun: seconds Kindle stuns; free: 1 the next Wick lit after a Kindle costs nothing; bonfire: 1 Kindle leaves a bonfire for 3 s where Wicks bite twice as fast (evolution) */
export const CHAIN_KINDLE: SkillDef = {
  id: "w_kindle",
  name: "Chain Kindle",
  kind: "attack",
  risk: "timed",
  button: "I",
  text: "Kindle bursts harder, pays back the Wick and chains to another.",
  levels: [
    {
      text: "Kindle deals 25% more and refunds all Wax.",
      values: { power: 0.25, refund: 1, radius: 0, chain: 0, stun: 0, free: 0, bonfire: 0 },
    },
    {
      text: "Kindle reaches 10 px further.",
      values: { power: 0.25, refund: 1, radius: 10, chain: 0, stun: 0, free: 0, bonfire: 0 },
    },
    {
      text: "Kindle deals 40% more.",
      values: { power: 0.4, refund: 1, radius: 10, chain: 0, stun: 0, free: 0, bonfire: 0 },
    },
    {
      text: "Kindle chains to one more Wick at 0.6x.",
      values: { power: 0.4, refund: 1, radius: 10, chain: 0.6, stun: 0, free: 0, bonfire: 0 },
    },
    {
      text: "Kindle stuns for 0.5 s.",
      values: { power: 0.4, refund: 1, radius: 10, chain: 0.6, stun: 0.5, free: 0, bonfire: 0 },
    },
    {
      text: "Kindle deals 60% more.",
      values: { power: 0.6, refund: 1, radius: 10, chain: 0.6, stun: 0.5, free: 0, bonfire: 0 },
    },
    {
      text: "The next Wick after a Kindle is free.",
      values: { power: 0.6, refund: 1, radius: 10, chain: 0.6, stun: 0.5, free: 1, bonfire: 0 },
    },
    {
      text: "Kindle deals 100% more.",
      values: { power: 1, refund: 1, radius: 10, chain: 0.6, stun: 0.5, free: 1, bonfire: 0 },
    },
  ],
  evolution: {
    partner: "w_gutter",
    name: "Bonfire",
    text: "Kindle leaves a bonfire for 3 s where Wicks bite twice as fast.",
    row: {
      text: "Kindle leaves a 3 s bonfire.",
      values: { power: 1, refund: 1, radius: 10, chain: 0.6, stun: 0.5, free: 1, bonfire: 1 },
    },
  },
};
