import type { SpriteCanvas } from "../../../engine/sprite";
import { grain } from "../../../utils/grain";
import { clamp, TAU } from "../../../utils/math";
import { VOID } from "./colors";
import type { Mirrored } from "./unblinkingMirror";
import type { UnblinkingPose } from "./unblinkingPose";
import type { BodyFrame } from "./unblinkingShape";

/** the ring behind the eye: its radius, how many arcs it breaks into, the share of each arc left dark, and how fast it turns */
const RING = { r: 27, arcs: 9, gap: 0.4, spin: 0.15 } as const;
/** the corona closes its ring above this strength, and its arcs crumble below that one */
const CLOSES = 0.7;
const CRUMBLES = 0.3;
/** streamers off the ring: how many, how far the longest reach, how fast they breathe and how much they twist */
const STREAMERS = { count: 22, reach: 16, rate: 0.9, twist: 0.02 } as const;
/** the share of a streamer's length that burns as hot as the ring, and the share past which it breaks up */
const STREAMER_HOT = 0.3;
const STREAMER_FRAYS = 0.75;

/**
 * The corona of a black sun behind the eye, drawn only where nothing else is: a ring of void light broken into arcs
 * that slowly turn, with streamers that breathe outward and twist. It closes and burns white as the eye gazes and
 * crumbles as it falls.
 */
export function paintCorona(m: Mirrored, s: SpriteCanvas, p: UnblinkingPose, f: BodyFrame, time: number): void {
  if (p.corona <= 0.02) return;
  const closed = clamp((p.corona - CLOSES) / (1 - CLOSES));
  const gap = RING.gap * (1 - closed) + Math.max(0, CRUMBLES - p.corona) * 1.5;
  const hot = p.corona > 0.85 ? VOID[5] : p.corona > 0.5 ? VOID[4] : VOID[3];
  const turn = time * RING.spin;
  s.begin();
  const steps = Math.ceil(TAU * RING.r * s.res * 1.3);
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    const along = (((a + turn) / TAU) * RING.arcs) % 1;
    if (along < gap) continue;
    const c = Math.cos(a);
    const n = Math.sin(a);
    m.behind(f.x + c * RING.r, f.y + n * RING.r, along > 0.85 ? VOID[5] : hot);
    m.behind(f.x + c * (RING.r + 0.5), f.y + n * (RING.r + 0.5), VOID[3]);
  }
  for (let j = 0; j < STREAMERS.count; j++) {
    const a0 = (j / STREAMERS.count) * TAU + turn * 0.5 + grain(j, 4) * 0.2;
    const long =
      STREAMERS.reach *
      (0.35 + 0.65 * grain(j, 11)) *
      (0.7 + 0.3 * Math.sin(time * STREAMERS.rate + j * 2.3)) *
      p.corona;
    for (let d = 0.5; d < long; d += 0.5) {
      const u = d / long;
      if (u > STREAMER_FRAYS && Math.floor(d * 2) % 2) continue;
      const a = a0 + d * STREAMERS.twist;
      const r = RING.r + 0.5 + d;
      const x = f.x + Math.cos(a) * r;
      const y = f.y + Math.sin(a) * r;
      const c = u < STREAMER_HOT ? hot : u < 0.65 ? VOID[3] : VOID[2];
      m.behind(x, y, c);
      if (u < STREAMER_HOT) m.behind(x - Math.sin(a) * 0.5, y + Math.cos(a) * 0.5, VOID[3]);
    }
  }
  s.commit(false);
}
