import type { HeroState } from "../../types/hero";

/**
 * Animation frames Ysra crosses from the pose shown last into a new clip, by the state she enters. Idle takes the
 * longest: it is where a blow, a landing or a hurt settles back into her guard. A hurt cuts at once, since the cut is
 * what the player has to read, a warp's arrival cuts at once, since she appears there, and the vault crosses into its
 * plant by itself.
 */
export const HANDOVER_FRAMES: Partial<Record<HeroState, number>> & { other: number } = {
  idle: 5,
  walk: 3,
  run: 3,
  warpStrike: 0,
  hurt: 0,
  dead: 0,
  vault: 0,
  other: 2,
};

/** a blow crosses in this many frames at most, and always at least one frame fewer than it has before its first hit,
 *  so its wind-up still reads */
export const BLOW_HANDOVER_FRAMES = 3;

/** frames a turn on the spot swings her limbs through to the new facing */
export const TURN_FRAMES = 2;

/**
 * Her landing: the hips sink by the fall speed over this many pixels per pixel a second, between the least and the
 * deepest dip, reach the bottom in `down` frames and rise back into the stand over the rest. The arms and the neck go
 * down with the hips by these parts.
 */
export const LANDING_DIP = {
  perSpeed: 1 / 80,
  least: 1.5,
  deepest: 4.5,
  down: 2,
  frames: 8,
  neck: 0.85,
  hands: 0.6,
} as const;
