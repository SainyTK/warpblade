import { ANIM_FPS } from "../../../constants/hero";
import { LANDING_DIP } from "../../../constants/ysra/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clamp, ease } from "../../../utils/math";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

/** her last fall speed in the air, and the dip she is taking on the floor */
const landing = { ground: true, fall: 0, since: 0, depth: 0 };
// each co-op player's Ysra lands on her own legs; only the host poses heroes
rememberPerSeat(objectMemory(landing, true));

/** the states a landing dips; anything else she lands into (a blow, a crash, a hurt) poses its own landing */
const DIPS: ReadonlySet<string> = new Set(["idle", "walk", "run"]);

/** how far down the dip is this many frames in: quickly down, then eased back up into the stand */
function dipAt(k: number): number {
  const L = LANDING_DIP;
  if (k < L.down) return (k + 1) / L.down;
  return 1 - ease.outQuad((k - L.down + 1) / (L.frames - L.down));
}

/** the knees take the landing: the harder the fall, the deeper the hips sink before they rise back into the stand */
export function landingDip(h: Hero, p: Pose, t: number): Pose {
  const L = LANDING_DIP;
  if (!h.ground) {
    Object.assign(landing, { ground: false, fall: Math.max(0, h.vy), depth: 0 });
    return p;
  }
  if (!landing.ground) {
    landing.ground = true;
    landing.since = t;
    landing.depth = clamp(landing.fall * L.perSpeed, L.least, L.deepest);
  }
  const k = Math.floor((t - landing.since) * ANIM_FPS + 1e-6);
  if (!landing.depth || k >= L.frames || !DIPS.has(h.state)) return p;
  const d = landing.depth * dipAt(k);
  return {
    ...p,
    hy: p.hy + d,
    ny: p.ny + d * L.neck,
    fy: p.fy + d * L.hands,
    by: p.by + d * L.hands,
  };
}

/** a fresh run: standing */
export function resetLandingDip(): void {
  Object.assign(landing, { ground: true, fall: 0, since: 0, depth: 0 });
}
