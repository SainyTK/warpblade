import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp } from "../../../utils/math";
import { AGAIN, SHEPHERD_DID, SHEPHERD_TIMES, steadyShepherd } from "./shepherdMoves";

export type Point = readonly [number, number];

export interface ShepherdPose {
  hip: Point;
  lean: number;
  nod: number;
  nearFoot: Point;
  farFoot: Point;
  butt: Point;
  angle: number;
  grip: number;
  hook: number;
  letGo: number;
  nearHand: Point;
  farHand: Point;
  swing: number;
  carried: number;
  lanternAt: Point;
  glow: number;
  heat: number;
  flare: number;
}

export interface Crook {
  butt: Point;
  top: Point;
  along: Point;
  across: Point;
  grip: Point;
  hookTip: Point;
}

export const CROOK_LENGTH = 58;
const CHAIN = 7;
const UP = -Math.PI / 2;
const SETTLE = { wind: 0.22, again: 0.12, strike: 0.06, toll: 0.3, call: 0.25, moonfall: 0.35, kneel: 0.2 } as const;
const STRIDE = 6.4;
const RECOVER_BLEND = 0.5;

const REST: ShepherdPose = {
  hip: [0, -20],
  lean: 4,
  nod: 0,
  nearFoot: [3, 0],
  farFoot: [-4, 0],
  butt: [15, 0],
  angle: UP - 0.08,
  grip: 27,
  hook: 1,
  letGo: 0,
  nearHand: [11, -27],
  farHand: [-3, -22],
  swing: 0,
  carried: 0,
  lanternAt: [16, -48],
  glow: 1,
  heat: 0,
  flare: 0,
};
const REAP_WIND: ShepherdPose = {
  ...REST,
  hip: [-2, -16],
  lean: 1,
  nod: -0.3,
  nearFoot: [6, 0],
  farFoot: [-8, 0],
  butt: [3, -24],
  angle: 2.85,
  grip: 4,
  hook: -1,
  farHand: [-5, -25],
  swing: 2.5,
  heat: 1,
  flare: 0.3,
};
const REAP_STRIKE: ShepherdPose = {
  ...REST,
  hip: [3, -15],
  lean: 8,
  nod: -0.2,
  nearFoot: [9, 0],
  farFoot: [-7, -2],
  butt: [-2, -13],
  angle: 0.12,
  grip: 6,
  hook: -1,
  farHand: [-8, -26],
  swing: 2.4,
  heat: 0.7,
  flare: 0.6,
};
const REAP_FOLLOW: ShepherdPose = {
  ...REAP_STRIKE,
  hip: [4, -14],
  lean: 9,
  butt: [2, -11],
  angle: 0.05,
  swing: 1.2,
  heat: 0.3,
  flare: 0.4,
};
const TOLL_WIND: ShepherdPose = {
  ...REST,
  hip: [-1, -21],
  lean: -2,
  nod: 0.6,
  nearFoot: [5, 0],
  farFoot: [-6, 0],
  butt: [4, -13],
  angle: UP + 0.05,
  grip: 47,
  farHand: [9, -30],
  swing: -0.2,
  heat: 1,
  glow: 1.4,
  flare: 0.2,
};
const TOLL_STRIKE: ShepherdPose = {
  ...REST,
  hip: [3, -16],
  lean: 9,
  nod: -0.8,
  nearFoot: [8, 0],
  farFoot: [-6, 0],
  butt: [-13, -55],
  angle: 0.9,
  grip: 47,
  farHand: [10, -18],
  swing: -0.4,
  heat: 0.5,
  glow: 1.2,
  flare: 0.5,
};
const CALL: ShepherdPose = {
  ...TOLL_WIND,
  lean: -1,
  nod: 0.8,
  farHand: [-10, -34],
  swing: 0,
  flare: 1,
};
const MOONFALL: ShepherdPose = {
  ...REST,
  hip: [-1, -21],
  lean: -2,
  nod: 1,
  nearFoot: [5, 0],
  farFoot: [-6, 0],
  butt: [18, 0],
  angle: UP - 0.12,
  grip: 27,
  letGo: 1,
  nearHand: [6, -63],
  farHand: [1, -63],
  carried: 1,
  lanternAt: [4, -64],
  heat: 1,
  glow: 1.5,
  flare: 0.5,
};
const MOONFALL_HOLD: ShepherdPose = { ...MOONFALL, lanternAt: [4, -67], nearHand: [6, -66], farHand: [1, -66] };
const KNEEL_POSE: ShepherdPose = {
  ...REST,
  hip: [-1, -9],
  lean: 3,
  nod: -1,
  nearFoot: [-8, -1],
  farFoot: [7, 0],
  butt: [12, 0],
  angle: UP - 0.05,
  grip: 22,
  farHand: [11, -18],
  carried: 1,
  lanternAt: [19, -3],
  glow: 0.25,
  heat: 0,
};
const LIMP: ShepherdPose = {
  ...REST,
  hip: [0, -17],
  lean: 7,
  nod: -1,
  butt: [17, 0],
  angle: UP + 0.25,
  grip: 22,
  farHand: [-2, -18],
  swing: 0.3,
  glow: 0.5,
};

const mixPoint = (a: Point, b: Point, u: number): Point => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export function blendPose(a: ShepherdPose, b: ShepherdPose, u: number): ShepherdPose {
  return {
    hip: mixPoint(a.hip, b.hip, u),
    lean: lerp(a.lean, b.lean, u),
    nod: lerp(a.nod, b.nod, u),
    nearFoot: mixPoint(a.nearFoot, b.nearFoot, u),
    farFoot: mixPoint(a.farFoot, b.farFoot, u),
    butt: mixPoint(a.butt, b.butt, u),
    angle: lerp(a.angle, b.angle, u),
    grip: lerp(a.grip, b.grip, u),
    hook: u < 0.5 ? a.hook : b.hook,
    letGo: lerp(a.letGo, b.letGo, u),
    nearHand: mixPoint(a.nearHand, b.nearHand, u),
    farHand: mixPoint(a.farHand, b.farHand, u),
    swing: lerp(a.swing, b.swing, u),
    carried: lerp(a.carried, b.carried, u),
    lanternAt: mixPoint(a.lanternAt, b.lanternAt, u),
    glow: lerp(a.glow, b.glow, u),
    heat: lerp(a.heat, b.heat, u),
    flare: lerp(a.flare, b.flare, u),
  };
}

function walkPose(time: number): ShepherdPose {
  const phase = (time * STRIDE) % (Math.PI * 2);
  const swing = Math.sin(phase);
  const planted = phase < Math.PI;
  const slide = planted ? phase / Math.PI : (phase - Math.PI) / Math.PI;
  const buttX = planted ? lerp(19, 11, slide) : lerp(11, 19, slide);
  const buttLift = planted ? 0 : Math.sin(slide * Math.PI) * 3;
  return {
    ...REST,
    hip: [0, -20 + Math.abs(swing) * 0.8],
    lean: 4 + swing * 0.6,
    nod: Math.sin(phase * 2) * 0.15,
    nearFoot: [3 + swing * 4, -Math.max(0, Math.cos(phase)) * 1.6],
    farFoot: [-4 - swing * 4, -Math.max(0, -Math.cos(phase)) * 1.6],
    butt: [buttX, -buttLift],
    angle: UP - 0.08 + (buttX - 15) * 0.012,
    farHand: [-3 - swing * 1.5, -22],
    swing: Math.sin(phase - 1) * 0.3,
  };
}

function strikePose(
  from: ShepherdPose,
  hit: ShepherdPose,
  follow: ShepherdPose,
  st: number,
  hold: number,
): ShepherdPose {
  if (st < SETTLE.strike) return blendPose(from, hit, ease.outCubic(st / SETTLE.strike));
  return blendPose(hit, follow, ease.outCubic(clamp((st - SETTLE.strike) / Math.max(0.01, hold - SETTLE.strike))));
}

function endOf(did: number): ShepherdPose {
  if (did === SHEPHERD_DID.reap) return REAP_FOLLOW;
  if (did === SHEPHERD_DID.toll) return TOLL_STRIKE;
  if (did === SHEPHERD_DID.call) return CALL;
  if (did === SHEPHERD_DID.moonfall) return MOONFALL_HOLD;
  return REST;
}

export function shepherdPose(e: Enemy, t: number): ShepherdPose {
  const time = t + e.seed;
  if ((e.stun > 0 && !steadyShepherd(e)) || e.air) return LIMP;
  const settle = (to: ShepherdPose, from: ShepherdPose, seconds: number) =>
    blendPose(from, to, ease.outBack(clamp(e.st / seconds)));
  switch (e.state) {
    case "walk":
      return walkPose(time);
    case "wind":
      return e.ax === AGAIN ? settle(REAP_WIND, REAP_FOLLOW, SETTLE.again) : settle(REAP_WIND, REST, SETTLE.wind);
    case "swipe":
      return strikePose(REAP_WIND, REAP_STRIKE, REAP_FOLLOW, e.st, SHEPHERD_TIMES.swing);
    case "charge":
      return settle(TOLL_WIND, REST, SETTLE.toll);
    case "shoot":
      return strikePose(TOLL_WIND, TOLL_STRIKE, TOLL_STRIKE, e.st, SHEPHERD_TIMES.tollHold);
    case "summon": {
      const shaken = settle(CALL, REST, SETTLE.call);
      const rattle = clamp(e.st / SETTLE.call);
      return {
        ...shaken,
        butt: [shaken.butt[0] + Math.sin(time * 34) * 1.4 * rattle, shaken.butt[1] + Math.cos(time * 29) * rattle],
        swing: Math.sin(time * 17) * 0.8 * rattle,
      };
    }
    case "volley":
      return settle(MOONFALL, REST, SETTLE.moonfall);
    case "beam":
      return blendPose(MOONFALL, MOONFALL_HOLD, ease.outCubic(clamp(e.st / 0.2)));
    case "burrow": {
      const down = blendPose(REST, KNEEL_POSE, ease.outCubic(clamp(e.st / SETTLE.kneel)));
      return { ...down, glow: down.glow * (0.75 + 0.25 * Math.sin(time * 23) * Math.sin(time * 7)) };
    }
    case "hop": {
      const u = clamp(e.st / SHEPHERD_TIMES.rise);
      const up = blendPose(KNEEL_POSE, REST, ease.outBack(u));
      return { ...up, swing: 2.2 * (1 - u) * (1 - u), glow: lerp(0.25, 1.8, ease.outCubic(u)), flare: 1 - u };
    }
    default:
      return blendPose(endOf(e.n), REST, ease.outCubic(clamp(e.st / RECOVER_BLEND)));
  }
}

export function crookOf(p: ShepherdPose): Crook {
  const along: Point = [Math.cos(p.angle), Math.sin(p.angle)];
  const across: Point = [-along[1] * p.hook, along[0] * p.hook];
  const top: Point = [p.butt[0] + along[0] * CROOK_LENGTH, p.butt[1] + along[1] * CROOK_LENGTH];
  return {
    butt: p.butt,
    top,
    along,
    across,
    grip: [p.butt[0] + along[0] * p.grip, p.butt[1] + along[1] * p.grip],
    hookTip: [top[0] + across[0] * 7.5 - along[0] * 2, top[1] + across[1] * 7.5 - along[1] * 2],
  };
}

export const nearHandOf = (p: ShepherdPose, crook: Crook): Point => mixPoint(crook.grip, p.nearHand, p.letGo);

export function lanternOf(p: ShepherdPose, crook: Crook): { anchor: Point; center: Point } {
  const hung: Point = [crook.hookTip[0] + Math.sin(p.swing) * CHAIN, crook.hookTip[1] + Math.cos(p.swing) * CHAIN];
  const center = mixPoint(hung, p.lanternAt, p.carried);
  const anchor = mixPoint(crook.hookTip, [center[0], center[1] - CHAIN], p.carried);
  return { anchor, center };
}
