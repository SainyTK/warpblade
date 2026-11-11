import { ANIM_FPS } from "../../../constants/hero";
import { STOP_DEPTH, TRAVEL_LOAD } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { motion } from "./motion";

/** when Kael last set off from a stand, and in what: a walk, a run or a dash */
const load = { at: Number.NEGATIVE_INFINITY, kind: "" };
// each co-op player's Kael keeps his own; only the host poses heroes
rememberPerSeat(objectMemory(load, true));

/**
 * Watch the change of clip from `last` to Kael's state: setting off from a stand marks a load, and a stride or dash
 * that stops on the spot settles onto the knees through the landing.
 */
export function watchTravel(h: Hero, t: number, last: string): void {
  if (last === h.state) return;
  if ((h.state === "walk" || h.state === "run" || h.state === "dash") && last === "idle")
    Object.assign(load, { at: t, kind: h.state });
  const depth = STOP_DEPTH[last];
  if (h.state === "idle" && depth !== undefined) Object.assign(motion, { landAt: t, landDepth: depth });
}

/** the load at the start of travel, easing out frame by frame */
export function travelPose(h: Hero, p: Pose, t: number): Pose {
  if (load.kind !== h.state) return p;
  const k = Math.floor((t - load.at) * ANIM_FPS + 1e-6);
  const shape = TRAVEL_LOAD[h.state];
  if (!shape || k >= shape.frames) return p;
  const u = 1 - k / shape.frames;
  const dip = shape.dip * u;
  const lean = shape.lean * u;
  return { ...p, hy: p.hy + dip, ny: p.ny + dip, nx: p.nx + lean, cb: p.cb + lean * 0.3 };
}
