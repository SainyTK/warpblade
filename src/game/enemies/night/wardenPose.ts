import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp } from "../../../utils/math";

/** How the Rift Warden holds its arms in each state, in its own art pixels from its body's center, facing +x. */
export interface WardenPose {
  /** elbow and hand of the arm on the side it faces, then of the far arm */
  front: Arm;
  rear: Arm;
  /** how wide the claws fan, 1 at rest */
  spread: number;
  /** how far a blow has gathered, 0 to 1: its fire burns hotter and its halo closes */
  heat: number;
  /** shadow gathered in each raised hand before a volley, 0 to 1 */
  charge: number;
  /** how fast it flies the way it faces and downward, as shares of its dive speed: cloak and tendrils stream back */
  ahead: number;
  down: number;
  /** the body shifts this far the way it faces: back before the dive */
  shift: number;
}
export interface Arm {
  elbow: readonly [number, number];
  hand: readonly [number, number];
}
type Reach = readonly [elbowX: number, elbowY: number, handX: number, handY: number];

/** arm shapes for the side it faces; the far arm mirrors them unless the state gives its own */
const REST: Reach = [17, 1, 20, 8];
const RAISED: Reach = [18, -8, 16, -17];
const SPREAD: Reach = [18, -6, 24, -5];
const POUNCE: Reach = [17, -9, 21, -19];
const THRUST: Reach = [16, 2, 22, 5];
const SWEPT: Reach = [-16, 0, -21, 6];
const SPENT: Reach = [16, 3, 18, 11];
/** seconds for the arms to reach a new shape, and the Warden's dive speed in art pixels a second */
const SETTLE = 0.2;
const DIVE_SPEED = 250;
/** a volley looses this long after the arms rise; the shadow in its hands has gathered by then */
const VOLLEY_AT = 0.6;

const mirrored = (r: Reach): Reach => [-r[0], r[1], -r[2], r[3]];
const arm = (from: Reach, to: Reach, u: number, sway: number): Arm => ({
  elbow: [lerp(from[0], to[0], u), lerp(from[1], to[1], u) + sway * 0.5],
  hand: [lerp(from[2], to[2], u), lerp(from[3], to[3], u) + sway],
});

export function wardenPose(e: Enemy, t: number): WardenPose {
  const u = ease.outBack(clamp(e.st / SETTLE));
  const sway = Math.sin((t + e.seed) * 2.2) * 1.2;
  const both = (to: Reach, from: Reach = REST): Pick<WardenPose, "front" | "rear"> => ({
    front: arm(from, to, u, sway),
    rear: arm(mirrored(from), mirrored(to), u, -sway),
  });
  const still = { spread: 1, heat: 0, charge: 0, ahead: 0, down: 0, shift: 0 };
  const gathered = clamp(e.st / SETTLE);
  if (e.state === "volley")
    return { ...still, ...both(RAISED), spread: 1.5, heat: gathered, charge: clamp(e.st / VOLLEY_AT) };
  if (e.state === "summon") return { ...still, ...both(SPREAD), spread: 2, heat: gathered };
  if (e.state === "wind") return { ...still, ...both(POUNCE), spread: 2, heat: gathered, shift: -2 * gathered };
  if (e.state === "dive")
    return {
      ...still,
      front: arm(POUNCE, THRUST, u, 0),
      rear: arm(mirrored(POUNCE), SWEPT, u, 0),
      spread: 1.6,
      heat: 1,
      ahead: clamp((e.vx * e.face) / DIVE_SPEED, -1, 1),
      down: clamp(e.vy / DIVE_SPEED, -1, 1),
      shift: 1,
    };
  if (e.state === "recover") return { ...still, ...both(REST, SPENT) };
  return { ...still, front: arm(REST, REST, 1, sway), rear: arm(mirrored(REST), mirrored(REST), 1, -sway) };
}
