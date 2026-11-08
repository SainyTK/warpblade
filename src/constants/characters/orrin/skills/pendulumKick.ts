import type { SkillDef } from "../../../../types/skill";

/** Pendulum Kick. Design: docs/skills/orrin.md. Values: from: swing speed in px/s the kick starts at; power: share more it deals; launch: 1 kicks launch minions; hook: 1 a pass that kicks 2 or more foes gives a hook back; stun: seconds kicked foes are stunned; twice: 1 each foe can be kicked going and coming back; echo: 1 at top speed an afterimage kicks again 0.2 s later; comet: 1 kicks leave a burning comet trail (evolution); echoAll: 1 the afterimage kicks on every pass (evolution) */
export const PENDULUM_KICK: SkillDef = {
  id: "o_pendulumkick",
  name: "Pendulum Kick",
  kind: "attack",
  risk: "timed",
  button: "auto",
  text: "Your swing kicks come sooner and hit harder.",
  levels: [
    {
      text: "Swing kicks from 110 px/s, +25%.",
      values: { from: 110, power: 0.25, launch: 0, hook: 0, stun: 0, twice: 0, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kicks launch minions.",
      values: { from: 110, power: 0.25, launch: 1, hook: 0, stun: 0, twice: 0, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kicks deal 45% more.",
      values: { from: 110, power: 0.45, launch: 1, hook: 0, stun: 0, twice: 0, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kicking 2 foes in a pass gives a hook back.",
      values: { from: 110, power: 0.45, launch: 1, hook: 1, stun: 0, twice: 0, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kicks stun for 0.5 s.",
      values: { from: 110, power: 0.45, launch: 1, hook: 1, stun: 0.5, twice: 0, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kick each foe going and coming back.",
      values: { from: 110, power: 0.45, launch: 1, hook: 1, stun: 0.5, twice: 1, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "Kicks deal 70% more.",
      values: { from: 110, power: 0.7, launch: 1, hook: 1, stun: 0.5, twice: 1, echo: 0, comet: 0, echoAll: 0 },
    },
    {
      text: "+100%; at top speed an afterimage kicks.",
      values: { from: 110, power: 1, launch: 1, hook: 1, stun: 0.5, twice: 1, echo: 1, comet: 0, echoAll: 0 },
    },
  ],
  evolution: {
    partner: "o_skylash",
    name: "Comet Heel",
    text: "Kicks leave a brass comet trail that burns foes under it, and the afterimage kicks on every pass.",
    row: {
      text: "Comet trails; the afterimage always kicks.",
      values: { from: 110, power: 1, launch: 1, hook: 1, stun: 0.5, twice: 1, echo: 1, comet: 1, echoAll: 1 },
    },
  },
};
