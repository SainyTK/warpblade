import type { Enemy, EnemyState } from "../../../../types/enemy";

export const HEART_HITS = { lash: 16, bomb: 12, puddle: 5, root: 16, sweep: 18, pulse: 17 } as const;
export const HEART_TIMES = {
  lash: 0.85,
  lashHold: 0.55,
  bomb: 0.8,
  bombHold: 0.45,
  root: 0.7,
  rootHold: 0.9,
  summon: 0.95,
  summonHold: 0.5,
  sweep: 1.05,
  sweepSpin: 1.7,
  pulse: 1.35,
  pulseHold: 0.7,
  wake: 1.8,
  rest: 0.6,
} as const;
export const HEART_ENRAGE = 0.5;
export const CORE = { x: 1, y: -34 } as const;
export const SWEEP_REACH = 80;
export const LASH_SPEED = 230;

export type HeartMove = "lash" | "bomb" | "root" | "summon" | "sweep" | "pulse";

export const MOVE_STATE: Record<HeartMove, EnemyState> = {
  lash: "wind",
  bomb: "volley",
  root: "charge",
  summon: "summon",
  sweep: "leap",
  pulse: "beam",
};

export const STRIKE_STATE: Record<HeartMove, EnemyState> = {
  lash: "swipe",
  bomb: "shoot",
  root: "burrow",
  summon: "hop",
  sweep: "lunge",
  pulse: "dive",
};

export const MOVES: readonly HeartMove[] = ["lash", "bomb", "root", "summon", "sweep", "pulse"];

export const moveOf = (e: Enemy): HeartMove | null => {
  for (const m of MOVES) if (MOVE_STATE[m] === e.state || STRIKE_STATE[m] === e.state) return m;
  return null;
};

export const striking = (e: Enemy): boolean => MOVES.some((m) => STRIKE_STATE[m] === e.state);

export const waking = (e: Enemy): boolean => e.state === "blink";

export const opened = (e: Enemy): boolean => e.phase === 2 && !(waking(e) && e.st < HEART_TIMES.wake * 0.45);

export const steadyHeart = (): boolean => true;

export function heartTakes(e: Enemy, dmg: number): number {
  if (waking(e)) return dmg * 0.25;
  return dmg;
}
