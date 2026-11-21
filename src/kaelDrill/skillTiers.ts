export const CHARGE_START = 0.2;

export const SKILL_TIERS = [
  {
    kind: "crescent",
    level: 1,
    name: "Crystal Crescent",
    threshold: 0.46,
    damage: 34,
    reach: 55,
    height: 24,
    intro: 0.36,
    duration: 0.87,
    color: 0x73eaff,
  },
  {
    kind: "spires",
    level: 2,
    name: "Rift Spires",
    threshold: 0.86,
    damage: 68,
    reach: 84,
    height: 54,
    intro: 0.43,
    duration: 1.08,
    color: 0x85f8ba,
  },
  {
    kind: "rift",
    level: 3,
    name: "Astral Rift",
    threshold: 1.27,
    damage: 112,
    reach: 137,
    height: 66,
    intro: 0.51,
    duration: 1.22,
    color: 0xec83ff,
  },
  {
    kind: "nova",
    level: 4,
    name: "Crystal Nova",
    threshold: 1.72,
    damage: 180,
    reach: 188,
    height: 115,
    intro: 0.64,
    duration: 1.52,
    color: 0xffdd9e,
  },
] as const;

export type SkillTier = (typeof SKILL_TIERS)[number];

export function chargedTier(heldFor: number): SkillTier | undefined {
  let tier: SkillTier | undefined;
  for (const option of SKILL_TIERS) {
    if (heldFor >= option.threshold) {
      tier = option;
    }
  }
  return tier;
}
