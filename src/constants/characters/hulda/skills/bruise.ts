import type { SkillDef } from "../../../../types/skill";

/** Bruising Knuckles. Design: docs/skills/hulda.md. Values: max: most stacks; damage: attack damage a stack deals each second; duration: seconds; haymaker: stacks the haymaker adds; grapple: stacks knees and throws add; spread: 1 a bruised foe that dies passes half on; mark: share more damage bruised foes take; shatter: attack damage each stack deals when shattered (evolution) */
export const BRUISING_KNUCKLES: SkillDef = {
  id: "h_bruise",
  name: "Bruising Knuckles",
  kind: "dot",
  risk: "easy",
  button: "J",
  text: "Your blows leave bruises that keep hurting.",
  levels: [
    {
      text: "Blows leave bruises.",
      values: { max: 3, damage: 0.08, duration: 3, haymaker: 1, grapple: 1, spread: 0, mark: 0, shatter: 0 },
    },
    {
      text: "Bruises hurt more.",
      values: { max: 3, damage: 0.1, duration: 3, haymaker: 1, grapple: 1, spread: 0, mark: 0, shatter: 0 },
    },
    {
      text: "The haymaker bruises deep.",
      values: { max: 3, damage: 0.1, duration: 3, haymaker: 3, grapple: 1, spread: 0, mark: 0, shatter: 0 },
    },
    {
      text: "Knees and throws bruise.",
      values: { max: 3, damage: 0.1, duration: 3, haymaker: 3, grapple: 2, spread: 0, mark: 0, shatter: 0 },
    },
    {
      text: "More bruises, lasting longer.",
      values: { max: 8, damage: 0.1, duration: 5, haymaker: 3, grapple: 2, spread: 0, mark: 0, shatter: 0 },
    },
    {
      text: "Bruises spread on a kill.",
      values: { max: 8, damage: 0.1, duration: 5, haymaker: 3, grapple: 2, spread: 1, mark: 0, shatter: 0 },
    },
    {
      text: "Bruised foes take more.",
      values: { max: 8, damage: 0.22, duration: 5, haymaker: 3, grapple: 2, spread: 1, mark: 0.1, shatter: 0 },
    },
    {
      text: "Up to 12 bruises, far stronger.",
      values: { max: 12, damage: 0.5, duration: 5, haymaker: 3, grapple: 2, spread: 1, mark: 0.1, shatter: 0 },
    },
  ],
  evolution: {
    partner: "h_haymaker",
    name: "Shatter",
    text: "A haymaker, slam or throw on a bruised foe shatters every bruise at once and passes half to foes near.",
    row: {
      text: "Heavy blows shatter bruises.",
      values: { max: 12, damage: 0.5, duration: 5, haymaker: 3, grapple: 2, spread: 1, mark: 0.1, shatter: 2 },
    },
  },
};
