import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * gain: Heat from blows is multiplied by this; parry and block: Heat they give; cost: rites cost this share (the
 * evolution's replaces the level's); drainDelay: seconds before Heat drains; heal: share of max HP a rite heals; low:
 * below a third of HP she takes this share less and builds double Heat (0 off); full: bonus to blows at full Heat;
 * noDrain: Heat never drains; ignite: seconds a rite lights the glaive, adding `glow` to blows and a `spark` burst
 */
const levels = grow({ gain: 1, parry: 0, block: 0, cost: 1, drainDelay: 2.5, heal: 0, low: 0, full: 0 }, [
  ["Heat builds faster.", { gain: 1.2 }],
  ["Your guard builds Heat.", { parry: 25, block: 5 }],
  ["Rites cost less.", { cost: 0.85 }],
  ["Heat builds faster and holds longer.", { gain: 1.4, drainDelay: 4 }],
  ["Rites heal you.", { heal: 0.03 }],
  ["Rites cost even less.", { cost: 0.7 }],
  ["Burn brighter when near death.", { low: 0.3 }],
  ["A full bar empowers your blows.", { gain: 1.7, full: 0.15 }],
]);

/** Kindling: her Heat economy and her sustain, gathered in one skill */
export const KINDLING: SkillDef = {
  id: "y_kindling",
  name: "Kindling",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Heat builds faster from your blows.",
  levels,
  evolution: {
    partner: "y_overheat",
    name: "Eternal Hearth",
    text: "Heat never drains, rites cost 40% less, and each rite lights the glaive for 3 seconds: blows hit harder and burst.",
    row: evolved(levels, "The hearth never cools.", { cost: 0.6, noDrain: 1, ignite: 3, glow: 0.3, spark: 1 }),
  },
};
