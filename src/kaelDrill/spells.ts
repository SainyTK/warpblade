export const SPELL_PREPARATION = 3;
export const INFUSION_HITS = 3;
export const SPELL_SELECTION_CUE = 0.9;
export const SPELL_RELEASE_RECOVERY = 0.19;
export const SPELLS = {
  fire: { name: "Fire", color: 0xff713c, core: 0xffefad, damage: 32, speed: 208, range: 125, radius: 23 },
  ice: { name: "Ice", color: 0x70eaff, core: 0xe9fcff, damage: 24, speed: 168, range: 124, radius: 15, freeze: 1.65 },
  thunder: { name: "Thunder", color: 0xdab6ff, core: 0xfff3a6, damage: 48, range: 145, radius: 20, delay: 0.105 },
} as const;

export type SpellKind = keyof typeof SPELLS;
export type TravelingSpell = Exclude<SpellKind, "thunder">;
export const SPELL_ORDER = ["fire", "ice", "thunder"] as const satisfies readonly SpellKind[];
export const SPELL_IMPACT_TIME = 0.38;
