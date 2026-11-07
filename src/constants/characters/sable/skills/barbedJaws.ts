import type { SkillDef } from "../../../../types/skill";

/** Barbed Jaws: Snares tear and bleed, and more of them. Values: rate: ability power a second the bleed deals per stack; time: seconds; max: stacks; snares: snares on the floor; mp, cooldown: the snare's cost and recharge; moving: a moving foe bleeds this many times as fast; volley: pixels a sprung snare shoots foes within; rearm: times the jaws re-arm; net: pixels of the bramble net a sprung snare throws. Design: docs/skills/sable.md */
export const BARBED_JAWS: SkillDef = {
  id: "s_barbed",
  name: "Barbed Jaws",
  kind: "dot",
  risk: "timed",
  button: "I",
  text: "Snares tear and bleed, and more of them.",
  levels: [
    {
      text: "Snares leave a bleed.",
      values: { rate: 0.15, time: 4, max: 1, snares: 2, mp: 20, cooldown: 3.5, moving: 1, volley: 0, rearm: 0, net: 0 },
    },
    {
      text: "Bleeds run longer and deeper.",
      values: { rate: 0.25, time: 6, max: 1, snares: 2, mp: 20, cooldown: 3.5, moving: 1, volley: 0, rearm: 0, net: 0 },
    },
    {
      text: "One more snare on the floor.",
      values: { rate: 0.25, time: 6, max: 1, snares: 3, mp: 20, cooldown: 3.5, moving: 1, volley: 0, rearm: 0, net: 0 },
    },
    {
      text: "Snares are cheaper and quicker.",
      values: {
        rate: 0.25,
        time: 6,
        max: 1,
        snares: 3,
        mp: 15,
        cooldown: 1.75,
        moving: 1,
        volley: 0,
        rearm: 0,
        net: 0,
      },
    },
    {
      text: "Moving foes bleed twice as fast.",
      values: {
        rate: 0.25,
        time: 6,
        max: 1,
        snares: 3,
        mp: 15,
        cooldown: 1.75,
        moving: 2,
        volley: 0,
        rearm: 0,
        net: 0,
      },
    },
    {
      text: "Bleeds stack.",
      values: { rate: 0.6, time: 6, max: 3, snares: 3, mp: 15, cooldown: 1.75, moving: 2, volley: 0, rearm: 0, net: 0 },
    },
    {
      text: "A sprung snare shoots every foe near it.",
      values: {
        rate: 0.6,
        time: 6,
        max: 3,
        snares: 3,
        mp: 15,
        cooldown: 1.75,
        moving: 2,
        volley: 70,
        rearm: 0,
        net: 0,
      },
    },
    {
      text: "Snares re-arm once, and bleeds run deep.",
      values: {
        rate: 1.2,
        time: 8,
        max: 3,
        snares: 3,
        mp: 15,
        cooldown: 1.75,
        moving: 2,
        volley: 70,
        rearm: 1,
        net: 0,
      },
    },
  ],
  evolution: {
    partner: "s_net",
    name: "Bloodtrap",
    text: "A sprung snare throws a bramble net; when it closes, every bleeding foe in it takes all its bleed at once.",
    row: {
      text: "Sprung snares throw a bleeding net.",
      values: {
        rate: 1.2,
        time: 8,
        max: 3,
        snares: 3,
        mp: 15,
        cooldown: 1.75,
        moving: 2,
        volley: 70,
        rearm: 1,
        net: 30,
      },
    },
  },
};
