import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { MAW_DID, MAW_WINDUP } from "./maw";
import type { Pt } from "./paint";

export interface MawPose {
  /** how wide the jaws gape, 0 to 1 */
  gape: number;
  /** how bright the gullet burns, 0 to 1 */
  heat: number;
  /** how far it rears back on its hind legs, in radians */
  rear: number;
  /** where the near hand rests */
  hand: Pt;
}

/** the maw's jaws, gullet, rear and near hand for what it is doing now */
export function mawPose(e: Enemy, t: number): MawPose {
  const w = waveScale(game.wave).windup;
  const breathe = 0.12 + Math.sin(t * 2) * 0.06;
  const rest: MawPose = { gape: breathe, heat: 0.15, rear: 0, hand: [16, 0] };
  if (e.state === "wind") {
    const k = clamp(e.st / (MAW_WINDUP.bite * w));
    return { gape: 0.3 + k * 0.7, heat: k * 0.7, rear: -0.08 * k, hand: [14, 0] };
  }
  if (e.state === "lunge") return { gape: e.st < 0.1 ? 1 : 0, heat: 0.5, rear: 0.06, hand: [20, 0] };
  if (e.state === "charge") {
    const k = clamp(e.st / (MAW_WINDUP.spit * w));
    return { gape: 0.4 + k * 0.4, heat: 0.3 + k * 0.7, rear: -0.12 * k, hand: [15, 0] };
  }
  if (e.state === "shoot") return { gape: 0.9, heat: 1, rear: -0.15, hand: [15, 0] };
  if (e.state === "volley") {
    const k = clamp(e.st / (MAW_WINDUP.rear * w));
    return { gape: 0.3 + k * 0.3, heat: 0.2 + k * 0.4, rear: -0.45 * Math.sqrt(k), hand: [10 - k * 2, -10 - k * 22] };
  }
  if (e.state === "recover" && e.n === MAW_DID.slam && e.st < 0.35)
    return { gape: 0.5, heat: 0.6, rear: 0.04, hand: [21, 0] };
  if (e.state === "recover" && e.n === MAW_DID.spit) return { ...rest, gape: 0.5, heat: 0.4 };
  return rest;
}

/** turn p by angle a around the pivot */
export function turn(p: Pt, pivot: Pt, a: number): [number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = p[0] - pivot[0];
  const y = p[1] - pivot[1];
  return [pivot[0] + x * c - y * s, pivot[1] + x * s + y * c];
}
