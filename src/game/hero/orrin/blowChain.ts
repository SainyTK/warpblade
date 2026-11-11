import { CHAIN_WIND, CHAIN_WHIP as W } from "../../../constants/orrin/chainLook";
import type { ChainBlowSpec } from "../../../constants/orrin/string";
import type { ChainBlow } from "../../../types/orrin";
import { lerp, smooth, TAU } from "../../../utils/math";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

/**
 * The chain's shape round his shoulder: the tip's angle and distance, the bend behind the hand, the slack, and how
 * flat its circle is seen (1 upright, less for Full Circle's level ring).
 */
export interface ChainShape {
  angle: number;
  r: number;
  bend: number;
  sag: number;
  flat: number;
}

/** the shape at rest: coiled and hanging from the hand */
const REST: ChainShape = { angle: W.restAngle, r: W.coil, bend: 0, sag: W.sag, flat: 1 };

/** the last shape drawn and the blow it belonged to, so a new blow crosses from it */
const last = { blow: "", st: 0, from: { ...REST }, shape: { ...REST } };
rememberPerSeat(objectMemory(last, true));

/** the shortest turn from one angle to another */
const turn = (a: number, b: number): number => ((((b - a) % TAU) + TAU * 1.5) % TAU) - Math.PI;

function mix(a: ChainShape, b: ChainShape, k: number): ChainShape {
  return {
    angle: a.angle + turn(a.angle, b.angle) * k,
    r: lerp(a.r, b.r, k),
    bend: lerp(a.bend, b.bend, k),
    sag: lerp(a.sag, b.sag, k),
    flat: lerp(a.flat, b.flat, k),
  };
}

/** a swing past the rest point that dies away: the bend starts full and overshoots the other way, the tip swings out */
const ring = (t: number): number => Math.cos((TAU * t) / W.period) * Math.exp(-W.damp * t);
const kick = (t: number): number => Math.sin((TAU * t) / W.period) * Math.exp(-W.damp * t);

/**
 * The blow's own shape at `st` seconds. Before the hit the chain winds where the blow winds it and trails the hand;
 * through the hit frames it sweeps at full reach, bent behind the hand (`turns` sweeps for Full Circle); after, it
 * whips past the end of the sweep, swings back and settles, then falls slack and coils back to the rest hang by `dur`.
 */
function ownShape(
  blow: ChainBlow | "hanging",
  spec: ChainBlowSpec,
  st: number,
  dur: number,
  reach: number,
  turns: number,
): ChainShape {
  const dir = Math.sign(spec.a1 - spec.a0) || 1;
  const span = spec.hitEnd - spec.hit;
  const end = spec.hit + span * turns;
  const flat = Math.abs(spec.a1 - spec.a0) >= TAU - 1e-6 ? W.ringFlat : 1;
  if (st < spec.hit) {
    const wind = CHAIN_WIND[blow];
    const k = smooth(0, spec.hit, st);
    const back: ChainShape = {
      angle: lerp(wind.from, wind.to, k),
      r: wind.reach,
      bend: -dir * W.bend,
      sag: W.sag * 0.4,
      flat: 1,
    };
    return mix(REST, back, smooth(0, spec.hit * 0.5, st));
  }
  if (st <= end && span > 0) {
    const f = (st - spec.hit) / span;
    return { angle: spec.a0 + (spec.a1 - spec.a0) * (f % 1), r: reach, bend: -dir * W.bend, sag: 0, flat };
  }
  const t = st - end;
  const whip: ChainShape = {
    angle: spec.a1 + dir * W.over * kick(t),
    r: reach + W.stretch * kick(t),
    bend: -dir * W.bend * ring(t),
    sag: W.sag * (1 - Math.exp(-W.damp * t)),
    flat,
  };
  return mix(whip, REST, smooth(end + W.period * 0.5, dur, st));
}

/**
 * The chain during a blow, crossing from whatever shape it had when the blow started: the rest loop, or the last
 * blow's follow-through when the string carries on.
 */
export function blowShape(
  blow: ChainBlow | "hanging",
  spec: ChainBlowSpec,
  st: number,
  dur: number,
  reach: number,
  turns: number,
): ChainShape {
  if (blow !== last.blow || st < last.st) last.from = { ...last.shape };
  last.blow = blow;
  last.st = st;
  const own = ownShape(blow, spec, st, dur, reach, turns);
  last.shape = mix(last.from, own, smooth(0, W.cross, st));
  return last.shape;
}

/** the chain is back in the rest loop: a later blow crosses from the hang */
export function restChain(): void {
  last.blow = "";
  last.shape = { ...REST };
}
