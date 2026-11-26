import type { ElementId } from "./campaign";

export type SoundId =
  | "swing"
  | "swingHeavy"
  | "hitFlesh"
  | "hitHeavy"
  | "hitArmour"
  | "hitSlime"
  | "crit"
  | "keen"
  | "warp"
  | "dash"
  | "jump"
  | "doubleJump"
  | "land"
  | "block"
  | "parry"
  | "hurt"
  | "defeat"
  | "foeDeath"
  | "cast"
  | "spellBlaze"
  | "spellFrost"
  | "spellStorm"
  | "spellVenom"
  | "spellVoid"
  | "resonance"
  | "chargeStep"
  | "chargeRelease"
  | "boom"
  | "thunder"
  | "shatter"
  | "levelUp"
  | "learn"
  | "pickup"
  | "coin"
  | "chest"
  | "bossRoar"
  | "bossDefeat"
  | "surge"
  | "gate"
  | "stageClear"
  | "mapSelect"
  | "menuMove"
  | "menuConfirm"
  | "denied"
  | "perfect"
  | "lunge"
  | "tired";

export interface SoundSpec {
  files: readonly string[];
  volume: number;
  pitchSpread: number;
  voices: number;
}

export interface PlayOptions {
  pitch?: number;
  volume?: number;
}

export type HitMaterial = "flesh" | "armour" | "slime";

export type MusicTrack = "map" | "stage1" | "stage2" | "stage3" | "stage4" | "boss";

export type SpellSound = Extract<SoundId, `spell${string}`>;

export type ElementSounds = Record<ElementId, SpellSound>;
