import type { ChainBlow } from "../../types/orrin";

/**
 * How his chain is drawn, in image pixels (half an art pixel each). Links alternate a ring seen face on and one seen
 * edge on, a `pitch` apart along the chain.
 */
export const CHAIN_LOOK = {
  pitch: 4,
  /** a face-on ring: half its length, half its width, and the same for the hole through it */
  ring: { long: 2.7, wide: 1.7, holeLong: 1.3, holeWide: 0.55 },
  /** an edge-on link: half its length and half its width */
  bar: { long: 1.9, wide: 0.7 },
  /** the dark line round every link */
  rim: 1,
  /** a pixel this far above a link's middle takes the light, this far below the shade */
  lit: -0.3,
  shaded: 1,
  /** the most links one chain is drawn with */
  most: 400,
} as const;

/**
 * The hook head, in art pixels along the chain's direction (x) and across it (y): a shank, a curl back toward the
 * chain and a point. Each entry is a place on its centre line and the metal's half thickness there.
 */
export const HOOK_SHAPE: readonly (readonly [number, number, number])[] = [
  [-0.5, 0, 0.75],
  [2.4, 0, 0.75],
  [3.7, 0.4, 0.8],
  [4.6, 1.5, 0.8],
  [4.4, 2.8, 0.75],
  [3.4, 3.7, 0.6],
  [2.3, 3.6, 0.42],
  [1.4, 2.8, 0.2],
];

/** the eye the chain runs through at the hook's root: its radius in art pixels */
export const HOOK_EYE = 1.1;

/** Iron Weight's spiked ball: its radius, how far its spikes stand out, and how many, in art pixels */
export const WEIGHT_SHAPE = { radius: 3, spike: 2.2, spikes: 8 } as const;

/**
 * A rift tear, in art pixels: half its height and half its width fully open for an air bite and for an ultimate's, how
 * ragged its edge is as a share of its width, and how far the sparks off its ends reach.
 */
export const TEAR_LOOK = {
  bite: { tall: 4.5, wide: 1.8, light: 14, strength: 0.4 },
  ult: { tall: 11, wide: 3.2, light: 30, strength: 0.45 },
  /** the slits in the sky an anchor and a bell drop out of */
  anchor: { tall: 6, wide: 1.5, light: 12, strength: 0.4 },
  bell: { tall: 6, wide: 1.4, light: 14, strength: 0.4 },
  ragged: 0.45,
  spark: 5,
} as const;

/** Whirlwall's spinning chain: how many blurred runs of links, and how long each run's trail is, in radians */
export const WHIRL_LOOK = { runs: 3, trail: 1.1, links: 5 } as const;

/** a bending chain is drawn through this many steps of its curve */
export const BEND_STEPS = 14;

/**
 * Anchor Pin's stake, in art pixels from the floor: its height, the half thickness of its shaft at the floor and under
 * the cap, and the cap's half width.
 */
export const STAKE_SHAPE = { tall: 5.5, foot: 0.45, neck: 0.8, cap: 1.5 } as const;

/**
 * The smear his body leaves along the arc of a swing: how far back it trails in radians at full strength, the lanes it
 * is drawn in and how far apart they sit, in art pixels, the share of each streak nearest him that is drawn two pixels thick, the speed at which a plain swing starts to smear and the speed
 * at which it smears in full, in pixels a second.
 */
export const SWING_SMEAR = { trail: 0.8, lanes: 7, gap: 2.2, thick: 0.55, from: 150, full: 300, bodyY: 12 } as const;

/**
 * Anchor Fall's anchor, in art pixels up from its crown at the bottom: its height, the stock's height and half width,
 * the half thickness of its shank, the flukes' half spread and rise, and the ring's radius.
 */
export const ANCHOR_SHAPE = {
  tall: 11,
  stock: 7.5,
  stockHalf: 3.2,
  shank: 0.75,
  fluke: 4.6,
  flukeRise: 3.6,
  ring: 1.3,
} as const;

/** Sky Lash's crescent, in art pixels: its outer radius, how thick it is at its middle, and its half span in radians */
export const CRESCENT_SHAPE = { radius: 5, thick: 2.2, span: 1.25, trail: 9 } as const;

/** Rift Bell's bell: its height from crown to lip in art pixels, at its plain size */
export const BELL_LOOK = { tall: 8 } as const;

/** Brass Kite's kite, in art pixels: half its height and half its width, and its ribbon tails */
export const KITE_SHAPE = { tall: 4.6, wide: 3.4, tails: 2, tailLength: 7 } as const;

/**
 * The chain's weight during a blow, in radians, pixels and game seconds. After the strike it whips `over` past the end
 * of the sweep and `stretch` past full reach, swinging back and forth every `period` and dying away at `damp` a second,
 * while the bend that trails the hand (`bend`) flips over and settles. Through the recovery it falls slack by `sag` and
 * coils to `coil` from his shoulder, hanging at `restAngle`. A new blow crosses from the chain's last shape over
 * `cross`. Full Circle's ring is seen from a little above, its height `ringFlat` of its width.
 */
export const CHAIN_WHIP = {
  over: 0.35,
  stretch: 4,
  period: 0.2,
  damp: 9,
  bend: 0.45,
  sag: 7,
  coil: 11,
  restAngle: 1.25,
  cross: 0.1,
  ringFlat: 0.35,
} as const;

/**
 * Where each blow winds the chain before it strikes, round his shoulder: the tip's angle at the start of the wind-up
 * and at its end, and its distance. The Lash draws it back behind him, the Rising Arc drags it along the floor ahead,
 * Full Circle swings it round over his head into the front, and the Hanging Arc throws it up behind him.
 */
export const CHAIN_WIND: Readonly<Record<ChainBlow | "hanging", { from: number; to: number; reach: number }>> = {
  lash: { from: -2.4, to: -2.85, reach: 20 },
  rising: { from: 0.9, to: 0.7, reach: 30 },
  circle: { from: -2.7, to: -0.9, reach: 20 },
  hanging: { from: -1.9, to: -2.6, reach: 18 },
};
