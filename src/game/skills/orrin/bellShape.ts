import type { Enemy } from "../../../types/enemy";
import { withCharms } from "../query";

/** seconds to drop and to rise, one swing across, and the toll ring's life */
export const BELL_TIME = { drop: 0.22, swing: 0.36, rise: 0.24, toll: 0.4 } as const;
/** the chain's length under the rift, the widest swing either side of straight down, how far the mouth strikes, and
 *  how far the toll ring reaches. A great bell is twice the size. */
export const BELL = {
  chain: 24,
  amp: 1.05,
  mouth: 9,
  wide: 16,
  toll: 40,
  stun: 0.6,
  tollStun: 0.5,
  above: 34,
} as const;

export type BellPhase = "drop" | "swing" | "toll" | "rise";

export interface Bell {
  /** the rift it hangs from, world pixels */
  x: number;
  y: number;
  phase: BellPhase;
  /** seconds into the phase */
  t: number;
  /** swings done and to do */
  passes: number;
  swings: number;
  /** foes the swing under way already struck */
  struck: Enemy[];
  /** 1, or 2 for the Great Bell */
  size: number;
  /** a flash on the bell's lip as it strikes */
  flash: number;
}

/** the bell's angle off straight down: drawn back to one side as it drops, then swinging through the bottom */
export function bellAngle(b: Bell): number {
  if (b.phase === "drop") return -BELL.amp;
  if (b.phase !== "swing") return b.swings % 2 ? BELL.amp : -BELL.amp;
  return -BELL.amp * Math.cos((Math.PI * (b.t + b.passes * BELL_TIME.swing)) / BELL_TIME.swing);
}

/** the chain's length now: paying out as it drops, drawn in as it rises */
export function bellChain(b: Bell): number {
  const full = BELL.chain * b.size;
  if (b.phase === "drop") return full * Math.min(1, b.t / BELL_TIME.drop);
  if (b.phase === "rise") return full * Math.max(0, 1 - b.t / BELL_TIME.rise);
  return full;
}

/** the middle of the bell's mouth, world pixels */
export function bellMouth(b: Bell): [number, number] {
  const a = bellAngle(b);
  const r = bellChain(b) + 6 * b.size;
  return [b.x + Math.sin(a) * r, b.y + Math.cos(a) * r];
}

/** the toll ring's reach now, 0 to its full size */
export const tollReach = (b: Bell): number =>
  b.phase === "toll" ? withCharms("area", BELL.toll * b.size) * Math.min(1, b.t / (BELL_TIME.toll * 0.5)) : 0;
