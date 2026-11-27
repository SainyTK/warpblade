import { HEAVY_SHAKE } from "../constants/hitFeel";
import type { SourceId } from "../types/build";
import { game } from "./state";

interface Request {
  time: number;
  amp: number;
  at: number;
}

const biggest = new Map<SourceId, number>();
let heavyAt = Number.NEGATIVE_INFINITY;
let pending: Request | null = null;

export function resetHeavyShake(): void {
  biggest.clear();
  heavyAt = Number.NEGATIVE_INFINITY;
  pending = null;
}

const recent = (at: number): boolean => game.t - at <= HEAVY_SHAKE.window;

function apply(time: number, amp: number): void {
  game.shake = Math.max(game.shake, time);
  game.amp = Math.max(game.amp, amp);
}

function markHeavy(): void {
  heavyAt = game.t;
  if (pending && recent(pending.at)) apply(pending.time, pending.amp);
  pending = null;
}

function topCut(): number {
  const sizes = [...biggest.values()].sort((a, b) => b - a);
  return sizes[Math.min(HEAVY_SHAKE.topSources, sizes.length) - 1] ?? 0;
}

export function noteHit(source: SourceId, damage: number): void {
  const best = Math.max(biggest.get(source) ?? 0, damage);
  biggest.set(source, best);
  if (best >= topCut() && damage >= best * HEAVY_SHAKE.share) markHeavy();
}

export function noteHurt(taken: number, maxHp: number): void {
  if (taken >= maxHp * HEAVY_SHAKE.hurtShare) markHeavy();
}

export function requestShake(time: number, amp: number): void {
  if (recent(heavyAt)) {
    apply(time, amp);
    return;
  }
  if (!pending || !recent(pending.at) || pending.amp < amp) pending = { time, amp, at: game.t };
}
