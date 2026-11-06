import { hold } from "../../../constants/clips/sable/stance";
import { ANIM_FPS } from "../../../constants/hero";
import type { HeroState } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { reloadShare } from "./reload";

/** where the grip rides from the neck, and the crossbow's angle, in each free state */
const CARRY: Partial<Record<HeroState, { x: number; y: number; sa: number }>> = {
  walk: { x: 4, y: 8.5, sa: 0.45 },
  run: { x: 5, y: 8, sa: 0.65 },
  jump: { x: 4.5, y: 6.5, sa: -0.15 },
  fall: { x: 4.5, y: 7, sa: 0.2 },
};

/** Kael's clip for a free state, with Sable's hands on the crossbow, riding with the chest so it moves as the body does */
export function carry(p: Pose, state: HeroState): Pose {
  const c = CARRY[state];
  if (!c) return p;
  return hold({ ...p, fx: p.nx + c.x, fy: p.ny + c.y, sa: c.sa, fe: 0, be: 0 });
}

/** reloading on the move: the crossbow tipped up, the far hand turning the crank under it in two-frame steps */
export function crank(p: Pose, t: number): Pose {
  const step = Math.floor(t * ANIM_FPS * 0.5) / (ANIM_FPS * 0.5);
  const a = step * Math.PI * 2 * 2.5;
  const share = reloadShare();
  // the first and last frames of the reload tip the crossbow in and out instead of cutting
  const tip = Math.min(1, share * 8, (1 - share) * 8);
  const sa = p.sa + (-0.75 - p.sa) * tip;
  const fx = p.nx + 3.5;
  const fy = p.ny + 9;
  const cx = fx - Math.cos(sa) * 1.5 + 1;
  const cy = fy - Math.sin(sa) * 1.5 + 2;
  return {
    ...p,
    fx: p.fx + (fx - p.fx) * tip,
    fy: p.fy + (fy - p.fy) * tip,
    sa,
    bx: p.bx + (cx + Math.cos(a) * 1.8 - p.bx) * tip,
    by: p.by + (cy + Math.sin(a) * 1.8 - p.by) * tip,
  };
}
