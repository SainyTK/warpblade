import type { SkillDef } from "../../../../types/skill";

/** Friction Burn. Design: docs/skills/orrin.md. Values: burn: seconds foes burn; damage: attack damage a second of the chain's own burn; spread: 1 the burn spreads on a kill; kick: share more burning foes take from the swing kick; trail: 1 a flame trail on the chain at 100 Momentum; scorch: 1 every swing leaves a burning arc in the air (evolution) */
export const FRICTION_BURN: SkillDef = {
  id: "o_friction",
  name: "Friction Burn",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "Foes the chain sweeps in a swing or a Full Circle catch fire.",
  levels: [
    { text: "Swept foes burn for 2 s.", values: { burn: 2, damage: 0.15, spread: 0, kick: 0, trail: 0, scorch: 0 } },
    { text: "Burns last 3 s.", values: { burn: 3, damage: 0.15, spread: 0, kick: 0, trail: 0, scorch: 0 } },
    { text: "The burn spreads on a kill.", values: { burn: 3, damage: 0.15, spread: 1, kick: 0, trail: 0, scorch: 0 } },
    {
      text: "Burning foes take 20% more from kicks.",
      values: { burn: 3, damage: 0.15, spread: 1, kick: 0.2, trail: 0, scorch: 0 },
    },
    { text: "Burns grow stronger.", values: { burn: 3, damage: 0.25, spread: 1, kick: 0.2, trail: 0, scorch: 0 } },
    {
      text: "Burns last 4 s and grow stronger.",
      values: { burn: 4, damage: 0.35, spread: 1, kick: 0.2, trail: 0, scorch: 0 },
    },
    {
      text: "A flame trail on the chain at full Momentum.",
      values: { burn: 4, damage: 0.35, spread: 1, kick: 0.2, trail: 1, scorch: 0 },
    },
    { text: "Burns are far stronger.", values: { burn: 4, damage: 0.5, spread: 1, kick: 0.2, trail: 1, scorch: 0 } },
  ],
  evolution: {
    partner: "o_pendulumkick",
    name: "Scorched Arc",
    text: "Every swing leaves a burning arc in the air that hurts foes passing through.",
    row: {
      text: "Swings leave burning arcs in the air.",
      values: { burn: 4, damage: 0.5, spread: 1, kick: 0.2, trail: 1, scorch: 1 },
    },
  },
};
