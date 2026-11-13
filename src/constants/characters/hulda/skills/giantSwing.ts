import type { SkillDef } from "../../../../types/skill";

/** Giant Swing. Design: docs/skills/hulda.md. Values: foes: other foes near that turn a throw into a swing; power: attack damage a turn; turns; reach: pixels; stun: seconds a struck foe reels; heldHit: 1 the swung foe takes each hit too; drag: pixels struck foes are pulled in; release: power of the knock-down as it lets go (0 none); cyclone: seconds the evolved swing lasts */
export const GIANT_SWING: SkillDef = {
  id: "h_giantSwing",
  name: "Giant Swing",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Throw into a crowd and you swing the foe round you first, striking every foe near. Hold the side behind for a suplex instead.",
  levels: [
    {
      text: "Throw into a crowd: swing the foe round you.",
      values: { foes: 2, power: 0.6, turns: 2, reach: 26, stun: 0, heldHit: 0, drag: 0, release: 0, cyclone: 0 },
    },
    {
      text: "Swung foes reel.",
      values: { foes: 2, power: 0.6, turns: 2, reach: 26, stun: 0.6, heldHit: 0, drag: 0, release: 0, cyclone: 0 },
    },
    {
      text: "The swung foe takes the hits too.",
      values: { foes: 2, power: 0.6, turns: 2, reach: 26, stun: 0.6, heldHit: 1, drag: 0, release: 0, cyclone: 0 },
    },
    {
      text: "One more turn.",
      values: { foes: 2, power: 0.6, turns: 3, reach: 26, stun: 0.6, heldHit: 1, drag: 0, release: 0, cyclone: 0 },
    },
    {
      text: "Wider, harder swing.",
      values: { foes: 2, power: 0.9, turns: 3, reach: 40, stun: 0.6, heldHit: 1, drag: 0, release: 0, cyclone: 0 },
    },
    {
      text: "The swing drags foes in.",
      values: { foes: 2, power: 0.9, turns: 3, reach: 40, stun: 0.6, heldHit: 1, drag: 12, release: 0, cyclone: 0 },
    },
    {
      text: "The release knocks foes down.",
      values: { foes: 2, power: 0.9, turns: 3, reach: 40, stun: 0.6, heldHit: 1, drag: 12, release: 1, cyclone: 0 },
    },
    {
      text: "Swing harder and wider.",
      values: { foes: 2, power: 1.2, turns: 3, reach: 48, stun: 0.6, heldHit: 1, drag: 12, release: 1, cyclone: 0 },
    },
  ],
  evolution: {
    partner: "h_ironChain",
    name: "Cyclone",
    text: "The swing keeps spinning for two seconds while you walk, pulling foes in.",
    row: {
      text: "Spin for two seconds, walking and pulling foes in.",
      values: { foes: 2, power: 1.2, turns: 3, reach: 60, stun: 0.6, heldHit: 1, drag: 16, release: 1, cyclone: 2 },
    },
  },
};
