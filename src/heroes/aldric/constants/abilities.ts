import type { AldricAbility } from "../types/state";

/** the order O turns through Aldric's abilities: his two base ones, then the spells his skills teach */
export const ALDRIC_ABILITIES: readonly AldricAbility[] = ["rush", "pillar", "lance", "mend", "rally"];
/** the skill that teaches each spell */
export const SPELL_SKILL = { lance: "al_lance", mend: "al_mend", rally: "al_rally" } as const;
/** MP each ability costs; the wide form costs half again */
export const ABILITY_COST: Readonly<Record<AldricAbility, number>> = {
  rush: 12,
  pillar: 16,
  lance: 14,
  mend: 20,
  rally: 16,
};
export const WIDE_COST = 1.5;
/** seconds each base ability takes to come back; a spell's comes from its skill's row */
export const BASE_RECHARGE = { rush: 3, pillar: 4.5 } as const;
/** each ability's tab label and colour */
export const ABILITY_TAB: Readonly<Record<AldricAbility, { label: string; tint: string }>> = {
  rush: { label: "RUSH", tint: "#ffe08a" },
  pillar: { label: "PILLAR", tint: "#fff3c0" },
  lance: { label: "LANCE", tint: "#ffd27a" },
  mend: { label: "MEND", tint: "#c8f0b0" },
  rally: { label: "RALLY", tint: "#ffb870" },
};

/** Shield Rush: wind-up, travel time and speed, its blow in ability power, and the wide form's burst */
export const RUSH = {
  load: 0.08,
  travel: 0.2,
  speed: 220,
  dur: 0.5,
  power: 1.4,
  stagger: 0.6,
  carry: 220,
  burstRadius: 30,
  burstPower: 1,
} as const;
/** Sunpillar: the call's clip, how far ahead it looks for a foe, the fall delay, the column, power and the wide row */
export const PILLAR = {
  dur: 0.46,
  hit: 0.2,
  reach: 130,
  fallback: 50,
  delay: 0.3,
  half: 10,
  power: 2.4,
  stun: 0.4,
  wideGap: 28,
  life: 0.55,
} as const;

/** Sanctuary: dome radius by charge level, seconds it stands, burns in that time, each burn's share of the level's power,
 *  and the share of damage Aldric takes inside it */
export const SANCTUARY = { radius: [40, 52, 64, 80], time: 3, burns: 6, share: 0.2, taken: 0.5 } as const;
