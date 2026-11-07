import type { SkillDef } from "../../../../types/skill";

/** Sweet Spot. Design: docs/skills/orrin.md. Values: tip: share more a tip hit deals; band: pixels the tip band grows; mark: share more a tip-marked foe takes, for markTime seconds; circleCrit: 1 Full Circle tips always crit; refund: stamina a tip hit gives back; perfect: 1 at 50+ Momentum tip hits deal double and send a shock (evolution); shock: the shock's reach in pixels, shockPower its share of attack damage */
export const SWEET_SPOT: SkillDef = {
  id: "o_sweetspot",
  name: "Sweet Spot",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Hits at the chain's tip deal much more.",
  levels: [
    { text: "Tip hits deal 25% more.", values: { tip: 0.25, band: 0, mark: 0, markTime: 2, circleCrit: 0, refund: 0, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "Tip hits +35%, the tip reaches in 4 px.", values: { tip: 0.35, band: 4, mark: 0, markTime: 2, circleCrit: 0, refund: 0, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "A tip hit marks the foe: +10% for 2 s.", values: { tip: 0.35, band: 4, mark: 0.1, markTime: 2, circleCrit: 0, refund: 0, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "Tip hits +45%.", values: { tip: 0.45, band: 4, mark: 0.1, markTime: 2, circleCrit: 0, refund: 0, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "Full Circle tips always crit.", values: { tip: 0.45, band: 4, mark: 0.1, markTime: 2, circleCrit: 1, refund: 0, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "A tip hit gives back 4 stamina.", values: { tip: 0.45, band: 4, mark: 0.1, markTime: 2, circleCrit: 1, refund: 4, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "Marked foes take +20%.", values: { tip: 0.45, band: 4, mark: 0.2, markTime: 2, circleCrit: 1, refund: 4, perfect: 0, shock: 0, shockPower: 0 } },
    { text: "Tip hits +70%.", values: { tip: 0.7, band: 4, mark: 0.2, markTime: 2, circleCrit: 1, refund: 4, perfect: 0, shock: 0, shockPower: 0 } },
  ],
  evolution: {
    partner: "o_perpetual",
    name: "Perfect Arc",
    text: "At 50 Momentum or more every tip hit deals double and sends a shock through the foes behind it.",
    row: { text: "At 50+ Momentum, tips deal double and shock.", values: { tip: 0.7, band: 4, mark: 0.2, markTime: 2, circleCrit: 1, refund: 4, perfect: 1, shock: 20, shockPower: 0.6 } },
  },
};
