import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp, TAU } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";

export type Pt = readonly [number, number];

/** where a Rune Golem's parts are this frame, in art pixels with its feet at y = 0, facing right */
export interface GolemPose {
  /** how far the body sinks */
  drop: number;
  /** how far the shoulders lean forward of the feet; the body shears with it */
  lean: number;
  /** how far the head hangs below its place on the shoulders */
  nod: number;
  backFist: Pt;
  frontFist: Pt;
  /** each foot's x and how high it is lifted */
  backFoot: Pt;
  frontFoot: Pt;
  /** how bright the runes burn, 0 to 1 */
  heat: number;
  eye: "open" | "hot" | "shut";
  /** the streak behind a punching fist, 1 as it lands to 0 */
  smear: number;
  /** the light arcing between its raised fists, 0 to 1 */
  strain: number;
}

const REST = { backFist: [-9, -7], frontFist: [10, -6], backFoot: [-6, 0], frontFoot: [4, 0] } as const;
const WALK = { frames: 6, strides: 1.5, reach: 1.5, lift: 1.5, swing: 1.2 };
const WIND = { lean: -2.5, backFist: [3, -9], frontFist: [-8, -20] } as const;
const PUNCH = { lean: 2.5, backFist: [-11, -9], frontFist: [18, -11], smear: 0.09, settle: 0.4 } as const;
const RAISED = { lean: -1, backFist: [-3, -31], frontFist: [6, -32] } as const;
const SLAM = {
  backFist: [-1, -2],
  frontFist: [11, -2],
  squash: 3,
  held: 2,
  until: 0.45,
  rise: 0.3,
  impact: -0.08,
} as const;
const HOT_FOR = 0.15;

const between = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const shaken = (p: Pt, t: number, amount: number): Pt => [
  p[0] + Math.sin(t * 61) * amount,
  p[1] + Math.sin(t * 47 + 1) * amount,
];

/** the slow pulse of the runes at rest */
const restHeat = (e: Enemy, t: number): number => 0.2 + Math.sin(t * 2.2 + e.seed) * 0.12;
/** the runes cooling from white hot back to their resting pulse */
const cooling = (e: Enemy, t: number): number =>
  e.st < HOT_FOR ? 1 : lerp(1, restHeat(e, t), clamp((e.st - HOT_FOR) / 0.3));

function standing(e: Enemy, t: number): GolemPose {
  return {
    drop: 0,
    lean: 0,
    nod: 0,
    backFist: REST.backFist,
    frontFist: REST.frontFist,
    backFoot: REST.backFoot,
    frontFoot: REST.frontFoot,
    heat: restHeat(e, t),
    eye: "open",
    smear: 0,
    strain: 0,
  };
}

/** a heavy trudge: the body drops as each foot lands and the fists swing against the legs */
function walking(e: Enemy, t: number): GolemPose {
  const phase = ((t + e.seed) * WALK.strides) % 1;
  const a = (Math.floor(phase * WALK.frames) / WALK.frames) * TAU;
  const s = Math.sin(a);
  const c = Math.cos(a);
  const drop = Math.abs(s) > 0.8 ? 1 : 0;
  const reel = e.stagger > 0 ? -1.5 : 0;
  return {
    ...standing(e, t),
    drop,
    lean: reel,
    backFist: [REST.backFist[0] + s * WALK.swing, REST.backFist[1] + drop + reel],
    frontFist: [REST.frontFist[0] - s * WALK.swing, REST.frontFist[1] + drop + reel],
    backFoot: [REST.backFoot[0] - s * WALK.reach, Math.max(0, -c) * WALK.lift],
    frontFoot: [REST.frontFoot[0] + s * WALK.reach, Math.max(0, c) * WALK.lift],
  };
}

export function golemPose(e: Enemy, t: number): GolemPose {
  const windup = waveScale(game.wave).windup;
  const rest = standing(e, t);
  if (e.air)
    return {
      ...rest,
      lean: -1,
      backFist: [-12, -19],
      frontFist: [13, -17],
      backFoot: [-7, 2],
      frontFoot: [5, 1.5],
    };
  if (e.stun > 0)
    return { ...rest, drop: 1, lean: 1, nod: 1.5, backFist: [-8, -3], frontFist: [9, -2], heat: 0, eye: "shut" };
  if (e.state === "walk") return walking(e, t);
  if (e.state === "wind") {
    const u = clamp(e.st / (0.6 * windup));
    const p = ease.outCubic(u);
    return {
      ...rest,
      drop: p > 0.5 ? 1 : 0,
      lean: WIND.lean * p,
      backFist: between(REST.backFist, WIND.backFist, p),
      frontFist: shaken(between(REST.frontFist, WIND.frontFist, p), t, u > 0.6 ? 0.4 : 0),
      heat: u,
      eye: u > 0.5 ? "hot" : "open",
    };
  }
  if (e.state === "swipe")
    return {
      ...rest,
      lean: PUNCH.lean,
      backFist: PUNCH.backFist,
      frontFist: PUNCH.frontFist,
      frontFoot: [6, 0],
      heat: 1,
      eye: "hot",
      smear: clamp(1 - e.st / PUNCH.smear),
    };
  if (e.state === "charge") {
    const u = clamp(e.st / (0.8 * windup));
    const p = ease.outCubic(clamp(u * 2.5));
    return {
      ...rest,
      drop: p > 0.6 ? -1 : 0,
      lean: RAISED.lean * p,
      backFist: shaken(between(REST.backFist, RAISED.backFist, p), t, u * 0.5),
      frontFist: shaken(between(REST.frontFist, RAISED.frontFist, p), t + 3, u * 0.5),
      heat: u,
      eye: u > 0.5 ? "hot" : "open",
      strain: u,
    };
  }
  if (e.n === 1) {
    // a slam just landed: squashed onto its fists, then pushing itself back up
    const up = ease.outCubic(clamp((e.st - SLAM.until) / SLAM.rise));
    return {
      ...rest,
      drop: e.st < SLAM.impact ? SLAM.squash : Math.round(SLAM.held * (1 - up)),
      lean: 1 - up,
      backFist: between(SLAM.backFist, REST.backFist, up),
      frontFist: between(SLAM.frontFist, REST.frontFist, up),
      heat: cooling(e, t),
      eye: e.st < HOT_FOR ? "hot" : "open",
    };
  }
  const q = ease.outCubic(clamp(e.st / PUNCH.settle));
  return {
    ...rest,
    lean: PUNCH.lean * (1 - q),
    backFist: between(PUNCH.backFist, REST.backFist, q),
    frontFist: between(PUNCH.frontFist, REST.frontFist, q),
    heat: cooling(e, t),
    eye: e.st < HOT_FOR ? "hot" : "open",
  };
}
