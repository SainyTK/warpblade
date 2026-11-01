import type { Color, Ramp } from "./color";

export const PK = {
  SPARK: 0,
  MOTE: 1,
  STREAK: 2,
  FLAKE: 3,
  VAPOUR: 4,
  DUST: 5,
  STAR: 6,
  EMBER: 7,
  SMOKE: 8,
  FIRE: 9,
  BRAND: 10,
  SHARD: 11,
} as const;
export type ParticleKind = (typeof PK)[keyof typeof PK];
/** SMOKES: a FIRE puff leaves smoke when it dies. BIG: bigger, slower smoke. */
export const PF = { SMOKES: 1, BIG: 2 } as const;

export interface Particle {
  k: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  col: Color;
  size: number;
  seed: number;
  delay: number;
  flag: number;
  sparks: Ramp;
  a: number;
  va: number;
}
