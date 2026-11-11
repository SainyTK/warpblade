import type { FistBlow } from "../../types/hulda";

/** How Hulda's effects look. Nothing here changes play. */

/**
 * The lights her blows throw, as radius, strength and seconds. They are small and take a saturated step of her ramp:
 * a hit-stop holds a light at full strength for several frames, and a wide pale one hides both fighters.
 */
export const THUD_LIGHT = {
  small: [12, 0.35, 0.12],
  mid: [20, 0.4, 0.18],
  big: [30, 0.45, 0.25],
} as const;
export type ThudSize = keyof typeof THUD_LIGHT;

/** what a landed blow throws off: pressure arcs, speed lines behind them, chips, and a dent in the floor under it */
export interface BlowLook {
  arcs: number;
  /** how far the outer arc opens, in pixels */
  size: number;
  /** the way the arcs and chips fly, in radians from straight ahead, positive down */
  angle: number;
  streaks: number;
  chips: number;
  dent: boolean;
}

/** the string's blows and the air hammer fist: each heavier than the last */
export const BLOW_LOOK: Record<FistBlow | "hammer", BlowLook> = {
  jab: { arcs: 1, size: 7, angle: 0, streaks: 0, chips: 3, dent: false },
  hook: { arcs: 2, size: 10, angle: -0.15, streaks: 3, chips: 6, dent: false },
  haymaker: { arcs: 3, size: 14, angle: 0.55, streaks: 0, chips: 10, dent: true },
  hammer: { arcs: 2, size: 10, angle: 1.2, streaks: 2, chips: 5, dent: false },
};

/** pressure arcs: seconds one lives, the gap between them, and half the angle each spans */
export const SHOCK_ARC = { life: 0.2, gap: 0.035, span: 0.95, breakFrom: 0.45 } as const;

/** chips: seconds they last, their gravity, and the share of their life they fade over */
export const CHIPS = { life: 0.7, gravity: 620, fade: 0.35 } as const;

/** a dent in the floor: seconds its cracks run out, glow and then cool, and how deep they zigzag */
export const DENT = { run: 0.06, glow: 0.3, cool: 0.6, depth: 3 } as const;

/** rubble thrown up from the floor by a slam: chips for each size of slam, and how far the dent's cracks reach */
export const SLAM_LOOK = {
  small: { chips: 6, dent: 7 },
  mid: { chips: 10, dent: 11 },
  big: { chips: 16, dent: 16 },
} as const;

/** the cold light of her iron form taking hold */
export const IRON_LIGHT = { radius: 26, strength: 0.4, life: 0.3 } as const;

/** the light of a spirit's blow: an ancestor's fist, a bear's maul */
export const SPIRIT_LIGHT = { radius: 22, big: 32, strength: 0.45, life: 0.25 } as const;

/** a plate breaking: its small cold light, how far its splinters snap out and how many there are */
export const PLATE_BREAK = { light: 12, strength: 0.45, life: 0.14, ring: 6, splinters: 6 } as const;

/**
 * Knuckle Wave's crescent: half its height, how sharply it bends back (larger is flatter), its echoes and the gap
 * between them, the lines of wind behind it as height and length, the rays of its burst and its soft light.
 */
export const WAVE_LOOK = {
  half: 6.5,
  bend: 11,
  echoes: 2,
  echoGap: 2.5,
  wind: [
    [-3.5, 8],
    [0.5, 12],
    [3.5, 7],
  ],
  rays: 8,
  light: 6,
} as const;

/** Bellow's rings: how flat they lie, when in their fade they break into dashes, and the soft light at her mouth */
export const ROAR_LOOK = { squash: 0.7, breakFrom: 0.6, light: 10 } as const;

/** the lines of torn air behind Titan Throw's flying heap: how many, the gap between them, their length and how far
 *  behind the heap's middle they start */
export const HEAP_TRAIL = { lines: 6, gap: 3.5, length: 26, behind: 9 } as const;
