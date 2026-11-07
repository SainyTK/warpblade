import type { SkillDef } from "../../../../types/skill";

/** Breaching Bolt: The string's closing bolt hits like a ram. Values: bonus: damage added to the closing bolt; push: its push multiple; breaks: it breaks guards; stun: seconds; radius, burst: its burst in pixels and attack damage; bodies: attack damage a thrown foe deals to foes it meets; pin, pinPower: seconds a foe slammed into the edge is held and the damage it takes; pierceAll: it passes through every foe; mark: damage taken added while pinned. Design: docs/skills/sable.md */
export const BREACHING_BOLT: SkillDef = {
  id: "s_breach",
  name: "Breaching Bolt",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The string's closing bolt hits like a ram.",
  levels: [
    { text: "The closing bolt hits harder and pushes farther.", values: { bonus: 0.6, push: 1.6, breaks: 0, stun: 0, radius: 0, burst: 0, bodies: 0, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "The closing bolt breaks guards and stuns.", values: { bonus: 0.6, push: 1.6, breaks: 1, stun: 0.4, radius: 0, burst: 0, bodies: 0, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "The closing bolt bursts on impact.", values: { bonus: 0.6, push: 1.6, breaks: 1, stun: 0.4, radius: 30, burst: 0.8, bodies: 0, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "The closing bolt hits much harder.", values: { bonus: 1.5, push: 1.6, breaks: 1, stun: 0.4, radius: 30, burst: 0.8, bodies: 0, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "Foes it throws hurt the foes they hit.", values: { bonus: 1.5, push: 1.6, breaks: 1, stun: 0.4, radius: 30, burst: 0.8, bodies: 1, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "A bigger, harder burst.", values: { bonus: 1.5, push: 1.6, breaks: 1, stun: 0.4, radius: 45, burst: 1.6, bodies: 1, pin: 0, pinPower: 0, pierceAll: 0, mark: 0 } },
    { text: "Foes slammed into the edge are pinned.", values: { bonus: 1.5, push: 1.6, breaks: 1, stun: 0.4, radius: 45, burst: 1.6, bodies: 1, pin: 1, pinPower: 1.5, pierceAll: 0, mark: 0 } },
    { text: "The closing bolt hits eight times as hard.", values: { bonus: 7, push: 1.6, breaks: 1, stun: 0.4, radius: 45, burst: 4, bodies: 1, pin: 1, pinPower: 1.5, pierceAll: 0, mark: 0 } },
  ],
  evolution: {
    partner: "s_heavyBoot",
    name: "Siege Bolt",
    text: "The closing bolt passes through the whole line, bursts on every foe and pins them to the floor; pinned foes take 50% more.",
    row: { text: "The closing bolt pins the whole line.", values: { bonus: 7, push: 1.6, breaks: 1, stun: 0.4, radius: 45, burst: 4, bodies: 1, pin: 1.2, pinPower: 1.5, pierceAll: 1, mark: 0.5 } },
  },
};
