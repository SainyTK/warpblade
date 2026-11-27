import type { SoundId } from "./audio";
import type { ElementId } from "./campaign";
import type { Color, Ramp } from "./color";
import type { ParticleKind } from "./particle";

export type FxTier = "early" | "mid" | "late" | "evolved";

export type FxShape = "burst" | "slash" | "pillar" | "wave" | "trail" | "bolt" | "nova" | "spikes" | "mark";

export interface TierFeel {
  rank: number;
  size: number;
  life: number;
  particles: number;
  light: number;
  lightStrength: number;
  bloom: number;
  shake: readonly [time: number, amp: number] | null;
  stop: number;
  flash: number;
  afterimages: number;
  debris: number;
  cracks: number;
  embers: number;
  sounds: number;
}

export interface ElementLook {
  ramp: Ramp;
  sparks: Ramp;
  dark: Color;
  particle: ParticleKind;
  linger: ParticleKind;
  sound: SoundId;
  rumble: SoundId;
}

export interface FxCast {
  id: string;
  element: ElementId;
  tier: FxTier;
  intensity: number;
  gradeInTier: number;
  mastery: number;
  size: number;
  feel: TierFeel;
  look: ElementLook;
  fillsScreen: boolean;
}

export interface FxAt {
  x: number;
  y: number;
  face?: number;
  toX?: number;
  toY?: number;
  reach?: number;
}

export interface SkillFxOptions {
  damage?: number;
  delay?: number;
  quiet?: boolean;
  element?: ElementId;
  signature?: FxSignature;
}

export interface ElementKit {
  look: ElementLook;
  motif(x: number, y: number, angle: number, length: number, alpha: number, rank: number): void;
  core(x: number, y: number, radius: number, alpha: number, rank: number): void;
  spray(x: number, y: number, count: number, speed: number, angle: number, spread: number): void;
  linger(x: number, y: number, count: number, spread: number): void;
}

export type FxShapeDraw = (cast: FxCast, at: FxAt, kit: ElementKit, progress: number, fade: number) => void;

export type FxSignature = FxShapeDraw;
