import type { ActionClip } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { s } from "./stance";

/** her guard: sunk onto the rear foot, the crossbow raised across her face, stock out toward the blow */
const HOLD = { hx: -1.5, hy: -12.5, cb: 0.5, nx: 0, ny: -22.5, fx: 5, fy: -20.5, sa: -0.55, ffx: 5, bfx: -6, ba: 0.3 };
const t = GUARD_TIMES;

/**
 * Sable's guard on the shared rig, in the shared segments: the crossbow snapped up across her face; the held guard
 * breathing; the jolt of a block, the stock driven back toward her and her weight onto the rear heel. The parry is
 * Point-Blank's kick, posed from her kick clip (`SABLE_CLIPS.kick`).
 */
export const SABLE_GUARD_CLIP = {
  dur: t.blockEnd,
  hit: 0,
  keys: [
    [0, s({ hx: -1, hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -17, sa: -0.1, ffx: 4, bfx: -5 })],
    [t.loopFrom, s(HOLD), "snap"],
    [frame(16), s({ ...HOLD, ny: -22, cb: 1, fy: -20 })],
    [frame(32), s({ ...HOLD, hy: -12, ny: -22.5, cb: 0.5, sa: -0.5 })],
    [t.loopTo - 0.001, s(HOLD)],
    [t.block, s({ ...HOLD, hx: -3, cb: -0.5, nx: -2, ny: -22, fx: 2.5, fy: -20, sa: -0.75, bfx: -7, ba: 0.6 }), "snap"],
    [t.block + frame(3), s({ ...HOLD, hx: -2.5, nx: -1, fx: 3.5, sa: -0.65, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, s(HOLD)],
  ],
} satisfies ActionClip;
