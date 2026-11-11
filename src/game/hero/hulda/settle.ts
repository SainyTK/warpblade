import { SETTLE_NUDGES } from "../../../constants/clips/hulda/settle";
import { GRIT } from "../../../constants/hulda/grit";
import type { Hero } from "../../../types/hero";
import type { HuldaSettle, HuldaSettleMemory } from "../../../types/hulda";
import { POSE_KEYS, type Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { hulda } from "./memory";

const fresh = (): HuldaSettleMemory => ({ kind: null, at: Number.NEGATIVE_INFINITY });

/** the one owner of the recovery her pose layer plays */
const settle: HuldaSettleMemory = fresh();
// only the host poses heroes, so each seat's pose layer is the host's alone
rememberPerSeat(objectMemory(settle, true));

/** a fresh run: no recovery under way */
export function resetSettle(): void {
  Object.assign(settle, fresh());
}

function begin(kind: HuldaSettle, t: number): void {
  settle.kind = kind;
  settle.at = t;
}

/**
 * Start a recovery from what changed since the last pose: a walk on the floor that came to a stand, or a turn on the
 * floor. `lastClip` and `lastFace` are the clip and facing shown last.
 */
export function watchSettle(h: Hero, t: number, lastClip: string, lastFace: number): void {
  if (!h.ground) return;
  const free = h.state === "idle" || h.state === "walk";
  if (free && h.face !== lastFace) begin("turn", t);
  else if (h.state === "idle" && lastClip === "walk") begin("stop", t);
}

/** add a change to a pose, joint by joint */
function add(p: Pose, n: Pose): Pose {
  const o = { ...p };
  for (const k of POSE_KEYS) o[k] = p[k] + n[k];
  return o;
}

/**
 * Her recoveries over the pose: the load of a walk from a stand, a stop or a turn under way, and a plate breaking over
 * whatever she does.
 */
export function settlePose(h: Hero, p: Pose, t: number): Pose {
  let o = p;
  const { start, flinch } = SETTLE_NUDGES;
  if ((h.state === "idle" || h.state === "walk") && hulda.push > 0 && hulda.push < start.dur) {
    o = add(o, sampleKeys(start.keys, hulda.push));
  }
  if (settle.kind) {
    const clip = SETTLE_NUDGES[settle.kind];
    const u = t - settle.at;
    const free = h.state === "idle" || h.state === "walk";
    if (u >= clip.dur || !free) settle.kind = null;
    else o = add(o, sampleKeys(clip.keys, u));
  }
  if (hulda.flinch > 0) o = add(o, sampleKeys(flinch.keys, GRIT.flinch - hulda.flinch));
  return o;
}
