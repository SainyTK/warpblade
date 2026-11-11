import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp, smooth } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import type { Pt } from "./paint";
import { AGAIN, CLEAVE, RIFT_STEP, SOVEREIGN_DID, SOVEREIGN_WINDUP } from "./sovereign";

/** How the Abyss Sovereign holds its body and blade, in its own art pixels with its feet at 0, facing +x. */
export interface SovereignPose {
  /** where both hands close on the grip, and the way the blade points from there, in radians (0 ahead, -PI/2 up) */
  grip: Pt;
  angle: number;
  /** 1 when the far hand is on the grip too, 0 when it hangs at its side */
  both: number;
  /** the blade is held behind the body, over the far shoulder */
  behind: boolean;
  /** the upper body: its lean forward in radians, and how far it drops and shifts ahead */
  lean: number;
  drop: number;
  shift: number;
  /** where each foot stands and how high it is lifted mid stride */
  front: Pt;
  rear: Pt;
  /** how hot the blade, eyes and crown burn, 0 to 1 */
  heat: number;
  /** light gathered at the blade's point as it calls the pillars, 0 to 1 */
  charge: number;
  /** the arc the blade has swept this swing, from where it started to where it is, and how far the smear has thinned */
  smear: { from: number; to: number; thin: number } | null;
  /** how far the body has sunk below the floor, and how wide the rift under it is open, 0 to 1 */
  sink: number;
  rift: number;
  /** how far the mantle's hem lifts, as when it rises out of the floor or swings hard */
  billow: number;
}

/** a held shape the pose eases between: grip, blade angle, far hand, lean, drop, shift and how wide the feet stand */
interface Key {
  grip: Pt;
  angle: number;
  both: number;
  lean: number;
  drop: number;
  shift: number;
  stance: number;
  behind: boolean;
}

/** walking: the blade held low in the near hand, its point scraping the floor ahead */
const LOW: Key = { grip: [12, -19], angle: 0.78, both: 0, lean: 0.04, drop: 0, shift: 0, stance: 4, behind: false };
/** the cleave held back: both hands over the far shoulder, the blade pointing up and back, its weight on the rear foot */
const RAISED: Key = {
  grip: [-10, -50],
  angle: -2.2,
  both: 1,
  lean: -0.18,
  drop: 1.5,
  shift: -2,
  stance: 7,
  behind: true,
};
/** the quicker second cut gathered: the blade swung back low behind it, ready to come up underarm */
const DRAWN_LOW: Key = {
  grip: [-5, -22],
  angle: 2.8,
  both: 1,
  lean: -0.06,
  drop: 3,
  shift: -1,
  stance: 7,
  behind: true,
};
/** the overhead cleave spent: bent over the blade, its point driven down at the floor ahead */
const CLOVEN: Key = { grip: [17, -17], angle: 0.92, both: 1, lean: 0.22, drop: 4, shift: 4, stance: 8, behind: false };
/** the underarm cut spent: the blade high and ahead, the body stretched up after it */
const RISEN: Key = { grip: [13, -45], angle: -1.1, both: 1, lean: -0.04, drop: 0, shift: 3, stance: 7, behind: false };
/** calling the pillars: the blade held straight up to the sky in both hands */
const SKYWARD: Key = {
  grip: [11, -52],
  angle: -Math.PI / 2,
  both: 1,
  lean: -0.06,
  drop: -0.5,
  shift: 0,
  stance: 7,
  behind: false,
};
/** gathering the rend: the blade raised high in both hands, point down, over the spot it will strike */
const POISED: Key = {
  grip: [14, -50],
  angle: Math.PI / 2,
  both: 1,
  lean: -0.1,
  drop: -1,
  shift: 1,
  stance: 6,
  behind: false,
};
/** the rend: down on one knee, the blade driven point first into the floor */
const PLANTED: Key = {
  grip: [17, -15],
  angle: Math.PI / 2,
  both: 1,
  lean: 0.24,
  drop: 8,
  shift: 3,
  stance: 10,
  behind: false,
};
/** sinking into the rift: both hands on the grip, the blade point down into the floor at its feet */
const SINKING: Key = { grip: [11, -27], angle: 1.4, both: 1, lean: 0.05, drop: 2, shift: 1, stance: 5, behind: false };

/** seconds for the body to reach a new held shape */
const SETTLE = 0.22;
/** the blade's angle where the cleave lands, ahead of it at chest height: the strike frame */
const STRIKE_ANGLE = { over: 0, under: 0.1 } as const;
/** how far the held blade creeps back while a cut gathers, overhead and underarm */
const CREEP = { over: -0.18, under: 0.12 } as const;
/** the swing reaches its spent angle this long after it starts, then holds there until the swing ends */
const SWING_DONE = 0.18;
/** a recovery holds the spent pose this long before it eases back to the walk */
const HOLD = { cleave: 0.18, call: 0.16, rend: 0.32 } as const;
/** after its hold a recovery takes this long to ease back into the walk, done well before the recovery ends */
const LOWER = 0.35;
/**
 * walking: strides a second in radians, where each foot stands from the middle, how far it reaches and lifts, how far
 * the body bobs, how far the grip and the blade's angle sway with the stride, and the walk speed of a full stride
 */
const WALK = {
  rate: 4.4,
  foot: 3,
  reach: 5.5,
  lift: 2.2,
  bob: 1.1,
  gripSway: 0.8,
  bladeSway: 0.05,
  speed: 26,
} as const;
/** where the feet stand, as shares of the stance ahead and behind, and how much of the body's shift each takes */
const FEET = { ahead: 0.9, aheadShift: 0.5, behindShift: 0.3 } as const;
/** how hot it burns walking, while sinking, and as each recovery begins */
const HEAT = { rest: 0.2, sinking: 0.5, cleave: 0.8, call: 0.9, rend: 1 } as const;
/** how far the blade lifts as the rend gathers */
const REND_LIFT = 2;
/** the swing speeds up into the strike: the share of the way to it goes as the share of the time to this power */
const SNAP = 1.5;
/** how deep below the floor the body goes in the rift, deeper than it is tall so the crown is gone too */
const RIFT_DEPTH = 60;
/** the rift opens over this share of the sink, and closes over this share of the rise */
const RIFT_OPEN = 0.25;
/** rising, it starts to lift the blade out of the floor once this share of the rise is done */
const RISE_STAND = 0.4;

const blend = (a: Key, b: Key, u: number): Key => ({
  grip: [lerp(a.grip[0], b.grip[0], u), lerp(a.grip[1], b.grip[1], u)],
  angle: lerp(a.angle, b.angle, u),
  both: lerp(a.both, b.both, u),
  lean: lerp(a.lean, b.lean, u),
  drop: lerp(a.drop, b.drop, u),
  shift: lerp(a.shift, b.shift, u),
  stance: lerp(a.stance, b.stance, u),
  behind: u < 0.5 ? a.behind : b.behind,
});

/** the full pose from a held shape, with the feet planted at its stance */
function standing(k: Key, heat: number): SovereignPose {
  return {
    grip: k.grip,
    angle: k.angle,
    both: k.both,
    behind: k.behind,
    lean: k.lean,
    drop: k.drop,
    shift: k.shift,
    front: [k.stance * FEET.ahead + k.shift * FEET.aheadShift, 0],
    rear: [-k.stance + k.shift * FEET.behindShift, 0],
    heat,
    charge: 0,
    smear: null,
    sink: 0,
    rift: 0,
    billow: 0,
  };
}

/** the walk: the held low blade, feet striding as fast as it moves, the body bobbing on each step */
function walking(e: Enemy, time: number): SovereignPose {
  const pace = clamp(Math.abs(e.vx) / WALK.speed);
  const p = time * WALK.rate;
  const swing = Math.sin(p);
  const pose = standing(LOW, HEAT.rest);
  pose.front = [WALK.foot + WALK.reach * pace * swing, -WALK.lift * pace * Math.max(0, Math.cos(p))];
  pose.rear = [-WALK.foot - WALK.reach * pace * swing, -WALK.lift * pace * Math.max(0, -Math.cos(p))];
  pose.drop = WALK.bob * pace * Math.abs(swing);
  pose.grip = [LOW.grip[0] + swing * pace * WALK.gripSway, LOW.grip[1] + pose.drop];
  pose.angle = LOW.angle - swing * pace * WALK.bladeSway;
  return pose;
}

/** the swing: the blade sweeps from its held angle through the strike to its spent angle, leaving a smear behind */
function swinging(e: Enemy, under: boolean): SovereignPose {
  const from = under ? DRAWN_LOW : RAISED;
  const to = under ? RISEN : CLOVEN;
  const strike = under ? STRIKE_ANGLE.under : STRIKE_ANGLE.over;
  // the strike lands at CLEAVE.strike, the body catching up through the follow-through
  const u = clamp(e.st / SWING_DONE);
  const body = blend(from, to, ease.outCubic(u));
  const fast = clamp(e.st / CLEAVE.strike);
  const slow = clamp((e.st - CLEAVE.strike) / (SWING_DONE - CLEAVE.strike));
  const start = from.angle + (under ? CREEP.under : CREEP.over);
  const angle = e.st < CLEAVE.strike ? lerp(start, strike, fast ** SNAP) : lerp(strike, to.angle, ease.outCubic(slow));
  const pose = standing({ ...body, behind: e.st < CLEAVE.strike * 0.5 }, 1);
  pose.angle = angle;
  pose.smear = { from: start, to: angle, thin: clamp((e.st - CLEAVE.strike) / (CLEAVE.swing - CLEAVE.strike)) };
  pose.billow = 1 - slow;
  return pose;
}

/** the recovery: holds what it just did, then eases back into the walk */
function recovering(e: Enemy, spent: Key, hold: number, heat: number): SovereignPose {
  const u = smooth(hold, hold + LOWER, e.st);
  return standing(blend(spent, LOW, u), lerp(heat, HEAT.rest, u));
}

/** the rift step: sinking with the blade planted, then rising out of the floor behind the hero, the blade coming up */
function riftStepping(e: Enemy): SovereignPose {
  if (e.st < RIFT_STEP.sink) {
    const k = e.st / RIFT_STEP.sink;
    const pose = standing(
      blend(LOW, SINKING, ease.outBack(clamp(e.st / SETTLE))),
      HEAT.sinking + k * (1 - HEAT.sinking),
    );
    pose.sink = RIFT_DEPTH * k * k;
    pose.rift = clamp(k / RIFT_OPEN);
    pose.billow = k;
    return pose;
  }
  const k = clamp((e.st - RIFT_STEP.sink) / RIFT_STEP.rise);
  const pose = standing(blend(SINKING, LOW, smooth(RISE_STAND, 1, k)), 1 - k * (1 - HEAT.sinking));
  pose.sink = RIFT_DEPTH * (1 - ease.outCubic(k));
  pose.rift = clamp((1 - k) / RIFT_OPEN);
  pose.billow = 1 - k;
  return pose;
}

/** the Sovereign's pose for what it is doing now, at this time with its own seed already added */
export function sovereignPose(e: Enemy, time: number): SovereignPose {
  const ws = waveScale(game.wave).windup;
  const settle = ease.outBack(clamp(e.st / SETTLE));
  if (e.state === "wind") {
    const again = e.ax === AGAIN;
    const held = again ? DRAWN_LOW : RAISED;
    const k = clamp(e.st / ((again ? SOVEREIGN_WINDUP.again : SOVEREIGN_WINDUP.cleave) * ws));
    // the second cut swings back out of the first one's follow-through
    const pose = standing(blend(again ? CLOVEN : LOW, held, settle), k);
    pose.angle += (again ? CREEP.under : CREEP.over) * k;
    return pose;
  }
  if (e.state === "swipe") return swinging(e, e.ax === AGAIN);
  if (e.state === "summon") {
    const k = clamp(e.st / (SOVEREIGN_WINDUP.call * ws));
    const pose = standing(blend(LOW, SKYWARD, settle), k);
    pose.charge = k;
    return pose;
  }
  if (e.state === "volley") {
    const k = clamp(e.st / (SOVEREIGN_WINDUP.rend * ws));
    const pose = standing(blend(LOW, POISED, settle), k);
    // it rises onto its toes as the rend gathers, the blade lifting with it
    pose.drop -= k;
    pose.grip = [pose.grip[0], pose.grip[1] - k * REND_LIFT];
    return pose;
  }
  if (e.state === "blink") return riftStepping(e);
  if (e.state === "recover") {
    if (e.n === SOVEREIGN_DID.cleave) return recovering(e, e.ax === AGAIN ? RISEN : CLOVEN, HOLD.cleave, HEAT.cleave);
    if (e.n === SOVEREIGN_DID.call) return recovering(e, SKYWARD, HOLD.call, HEAT.call);
    if (e.n === SOVEREIGN_DID.rend) return recovering(e, PLANTED, HOLD.rend, HEAT.rend);
  }
  return walking(e, time);
}
