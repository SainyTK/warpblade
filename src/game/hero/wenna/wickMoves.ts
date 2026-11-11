import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import type { Wick } from "../../../types/wenna";
import { clamp } from "../../../utils/math";

/**
 * What a Wick is winding up to do: a bite on its own timer, a bite Wenna's Flare or a hop calls for, Pack Lunge's
 * leap, or a jump (a hop up to a platform or her guard's leap at a flier). Each loads for its wind-up first, so the
 * Wick sinks and draws back before it travels or strikes; Pack Lunge then leaps and strikes when it lands.
 */
export type WickPlan =
  | { kind: "bite" | "call"; foe: Enemy; left: number }
  | { kind: "pack"; foe: Enemy; left: number; leaping: boolean }
  | { kind: "jump"; vx: number; vy: number; left: number };

/**
 * The plans and the landing squashes of every Wick in the room, by Wick id. They belong to the Wicks themselves, which
 * live in the host's world (`wickWorld.ts`), so like that list they are kept once for the room.
 */
const plans = new Map<number, WickPlan>();
const squashes = new Map<number, number>();

/** the wind-up a plan of this kind holds before it acts */
export const loadOf = (kind: WickPlan["kind"]): number => (kind === "jump" ? WICK.hopLoad : WICK.load);

export const planOf = (w: Wick): WickPlan | undefined => plans.get(w.id);

/**
 * Start a plan. A Wick already winding up keeps the plan it has, except that a called bite takes over a bite on its own
 * timer at the point its wind-up has reached, and the timer is handed back so the next timed bite follows.
 */
export function plan(w: Wick, p: WickPlan): void {
  const held = plans.get(w.id);
  if (held && !(held.kind === "bite" && p.kind === "call")) return;
  if (held) w.bite = 0;
  plans.set(w.id, held ? { ...p, left: Math.min(p.left, held.left) } : p);
}

export function endPlan(w: Wick): void {
  plans.delete(w.id);
}

/** the Wick touched down from a hop, a leap or a fall: its body squashes into the floor and springs back */
export function squash(w: Wick): void {
  squashes.set(w.id, WICK.landSquash);
}

/** count a Wick's landing squash down */
export function tickSquash(w: Wick, dt: number): void {
  const left = (squashes.get(w.id) ?? 0) - dt;
  if (left > 0) squashes.set(w.id, left);
  else squashes.delete(w.id);
}

/** 0 to 1 into the wind-up of the plan under way, 0 with none or once a leap is flying */
export function loadOfWick(w: Wick): number {
  const p = plans.get(w.id);
  if (!p || (p.kind === "pack" && p.leaping)) return 0;
  return clamp(1 - p.left / loadOf(p.kind));
}

/** 1 the moment a Wick lands, easing to 0 */
export const squashOfWick = (w: Wick): number => clamp((squashes.get(w.id) ?? 0) / WICK.landSquash);

/** a Wick that has ended takes its plan and squash with it */
export function forgetWick(w: Wick): void {
  plans.delete(w.id);
  squashes.delete(w.id);
}

/** a new run: no Wick is winding up */
export function clearWickMoves(): void {
  plans.clear();
  squashes.clear();
}
