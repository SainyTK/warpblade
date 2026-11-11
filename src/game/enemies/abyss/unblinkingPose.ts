import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import { grain } from "../../../utils/grain";
import { clamp, ease, lerp } from "../../../utils/math";
import { hero } from "../../state";
import { GAZE } from "./gaze";
import { LANCE } from "./sightLance";
import { SHUT, TEAR_WINDUP } from "./unblinking";
import { BALL } from "./unblinkingShape";

/** How The Unblinking holds its lids, iris, lashes and nerves in each state, in its own art pixels on screen. */
export interface UnblinkingPose {
  /** how far the upper lid is raised: 0 shut on the seam, 1 at rest, above 1 pulled back past its rest */
  open: number;
  /** how far the lower lid sits from the seam, 1 at rest, less as it swells up into the eye */
  low: number;
  /** the iris's middle, from the eye's middle */
  lookX: number;
  lookY: number;
  /** the pupil's radius */
  pupil: number;
  /** how bright the thin ring of light around the pupil burns, 0 to 1 */
  limb: number;
  /** how hot the iris burns, 0 to 1 */
  heat: number;
  /** how fiercely it glares as it gazes, 0 to 1: its veins burn and its white flushes crimson */
  glare: number;
  /** how strong the corona behind it shines, 0 dark to 1 closed and white hot */
  corona: number;
  /** how the thorns stand: 1 an erect crown, 0 at rest, -1 limp */
  crown: number;
  /** how far the tear under the lid has swollen, 0 to 1, and how much of the tears' trail is still hanging after */
  swell: number;
  drip: number;
  /** how far the nerves stream up as it falls, 0 to 1 */
  fall: number;
  /** it lies on the floor, its nerves sprawled */
  lying: boolean;
  /** sideways shiver of the whole eye */
  shiver: number;
  /** a gaze has found nothing: the lids hang heavy, the white flushes and the iris twitches */
  strain: boolean;
}

/** the pose it drifts in, and the start every state works from */
const REST = { open: 0.85, pupil: 2.6, limb: 0.3, heat: 0.2, corona: 0.55 } as const;
/** how far the iris can move from the middle, and how far away a target must be for it to go all the way */
const LOOK = { x: 7.5, y: 4, reach: 70 } as const;
/** it aims a little above Kael's feet, at his body */
const AIM_ABOVE_FEET = 16;
/** the iris's small jumps while it drifts: seconds between them and how far they go */
const SACCADE = { every: 1.9, size: 1.2 } as const;
/** while it strains: how much its lids close, seconds between the iris's twitches, how long each lasts and how far */
const STRAIN = { open: 0.62, gazeOpen: 0.82, low: 0.9, corona: 0.6, crown: 0.7 } as const;
const TWITCH = { every: 0.55, lasts: 0.08, size: 1.5 } as const;
/** a wide stare as it burns lances, the pupil shrunk to a hot point */
const STARE = { open: 1.05, pupil: 1.1 } as const;
/** the gaze: lids pulled back past their rest, a wide black pupil, and how far below the eye it looks at the wall */
const GAZING = { open: 1.15, pupil: 4.8, below: 40 } as const;
/** the tears: how far the lids squint and the lower lid swells, and how wide the pupil opens */
const WEEP = { open: 0.55, low: 0.65, pupil: 4, shiver: 0.5, flare: 1, rebound: 1.12 } as const;
/** seconds the lid takes to slam shut as it falls, and seconds before it opens again that the lid starts to part */
const SLAM = 0.09;
const PART = 1.6;
/** how wide the lid parts at the end of its rest, and how fast the parting lid flutters */
const PARTED = { open: 0.28, flutter: 0.05, rate: 14 } as const;
/** the corona breaks apart over this many seconds of the fall */
const CORONA_DIES = 0.3;
/** waking on the floor: below this height it is still rising from it; how open it starts, and seconds to settle */
const WAKE = { below: 100, open: 0.3, settle: 0.8 } as const;
/** speed of the fall at which the nerves stream all the way up */
const FALL_FULL = 250;
/** below half health its iris and corona burn at least this hot */
const ENRAGED = { heat: 0.55, limb: 0.5, corona: 0.3 } as const;

/** the iris offset that looks at (tx, ty) from the eye */
function lookAt(e: Enemy, tx: number, ty: number): [number, number] {
  return [clamp((tx - e.x) / LOOK.reach, -1, 1) * LOOK.x, clamp((ty - e.y) / LOOK.reach, -1, 1) * LOOK.y];
}

/** the gaze's wall: where it is now, or where it will come from while the gaze gathers */
function wallX(e: Enemy): number {
  const from = e.side > 0 ? -GAZE.half : W + GAZE.half;
  if (e.state !== "volley") return from;
  return from + e.side * clamp(e.st / GAZE.cross) * (W + GAZE.half * 2);
}

function awake(e: Enemy, time: number): UnblinkingPose {
  const [hx, hy] = lookAt(e, hero.x, hero.y - AIM_ABOVE_FEET);
  const beat = Math.floor(time / SACCADE.every);
  const rest: UnblinkingPose = {
    ...REST,
    low: 1,
    lookX: hx + (grain(beat, 1) - 0.5) * 2 * SACCADE.size,
    lookY: hy + (grain(beat, 2) - 0.5) * SACCADE.size,
    glare: 0,
    crown: 0,
    swell: 0,
    drip: 0,
    fall: 0,
    lying: false,
    shiver: 0,
    strain: false,
  };
  if (e.state === "wind") {
    const k = clamp(e.st / LANCE.warn);
    return {
      ...rest,
      lookX: hx,
      lookY: hy,
      open: lerp(REST.open, STARE.open, ease.outCubic(k)),
      pupil: lerp(REST.pupil, STARE.pupil, k),
      heat: lerp(REST.heat, 1, k),
      limb: lerp(REST.limb, 0.8, k),
      crown: 0.4 * k,
      corona: lerp(REST.corona, 0.75, k),
    };
  }
  if (e.state === "beam")
    return {
      ...rest,
      lookX: hx,
      lookY: hy,
      open: STARE.open,
      pupil: STARE.pupil,
      heat: 1,
      limb: 1,
      crown: 0.5,
      corona: 0.8,
    };
  if (e.state === "summon") {
    if (e.st < TEAR_WINDUP) {
      const k = e.st / TEAR_WINDUP;
      return {
        ...rest,
        lookX: hx * 0.5,
        lookY: LOOK.y,
        open: lerp(REST.open, WEEP.open, ease.outCubic(k)),
        low: lerp(1, WEEP.low, k),
        pupil: lerp(REST.pupil, WEEP.pupil, k),
        swell: k,
        crown: -0.3 * k,
        shiver: WEEP.shiver * k,
      };
    }
    const u = clamp((e.st - TEAR_WINDUP) / (1 - TEAR_WINDUP));
    return {
      ...rest,
      lookX: hx * 0.5,
      lookY: LOOK.y * (1 - u),
      open: lerp(WEEP.flare, REST.open, ease.outCubic(u)),
      low: lerp(WEEP.rebound, 1, ease.outCubic(u)),
      pupil: lerp(WEEP.pupil, REST.pupil, u),
      drip: 1 - u,
    };
  }
  if (e.state === "charge") {
    const k = clamp(e.st / GAZE.warn);
    const [wx, wy] = lookAt(e, wallX(e), e.y + GAZING.below);
    const turn = ease.outCubic(clamp(k * 2));
    return {
      ...rest,
      lookX: lerp(hx, wx, turn),
      lookY: lerp(hy, wy, turn),
      open: lerp(REST.open, GAZING.open, ease.outCubic(k)),
      pupil: lerp(REST.pupil, GAZING.pupil, k),
      limb: k,
      heat: lerp(REST.heat, 1, k),
      corona: lerp(REST.corona, 1, k),
      glare: k,
      crown: k,
    };
  }
  if (e.state === "volley") {
    const [wx, wy] = lookAt(e, wallX(e), e.y + GAZING.below);
    return {
      ...rest,
      lookX: wx,
      lookY: wy,
      open: GAZING.open,
      pupil: GAZING.pupil,
      limb: 1,
      heat: 1,
      corona: 1,
      glare: 1,
      crown: 1,
    };
  }
  if (e.state === "recover") {
    const u = ease.outCubic(clamp(e.st / WAKE.settle));
    const waking = e.y > WAKE.below;
    return {
      ...rest,
      open: lerp(waking ? WAKE.open : STARE.open, REST.open, u),
      corona: lerp(waking ? 0.2 : 0.8, REST.corona, u),
      crown: lerp(waking ? -0.6 : 0.5, 0, u),
    };
  }
  return rest;
}

/** shut and fallen: the lid slams as it drops, rests shut on the floor, then parts a little before it opens */
function shut(e: Enemy, time: number): UnblinkingPose {
  const falling = e.vy > 0 || e.st < SLAM;
  const k = clamp((e.st - (SHUT - PART)) / PART);
  const parting = k > 0 ? PARTED.open * k * k + PARTED.flutter * k * Math.sin(time * PARTED.rate) : 0;
  return {
    open: e.st < SLAM ? GAZING.open * (1 - e.st / SLAM) : Math.max(0, parting),
    low: 1,
    lookX: 0,
    lookY: LOOK.y * 0.5,
    pupil: 1.4,
    limb: 0.6,
    heat: 0.6,
    glare: 0,
    corona: falling ? REST.corona * clamp(1 - e.st / CORONA_DIES) : 0.35 * k,
    crown: falling ? 0.8 : lerp(-1, -0.4, k),
    swell: 0,
    drip: 0,
    fall: falling ? clamp(e.vy / FALL_FULL) : 0,
    lying: !falling,
    shiver: 0,
    strain: false,
  };
}

/** the pose for what it is doing now */
export function unblinkingPose(e: Enemy, t: number): UnblinkingPose {
  const time = t + e.seed;
  const p = e.state === "blink" ? shut(e, time) : awake(e, time);
  if (e.state !== "blink" && e.n > 0) {
    const gazing = e.state === "charge" || e.state === "volley";
    p.strain = true;
    p.open *= gazing ? STRAIN.gazeOpen : STRAIN.open;
    p.low *= STRAIN.low;
    p.corona *= STRAIN.corona;
    p.crown -= STRAIN.crown;
    if (time % TWITCH.every < TWITCH.lasts)
      p.lookX += (grain(Math.floor(time / TWITCH.every), 5) > 0.5 ? 1 : -1) * TWITCH.size;
  }
  if (e.phase === 2 && e.state !== "blink") {
    p.heat = Math.max(p.heat, ENRAGED.heat);
    p.limb = Math.max(p.limb, ENRAGED.limb);
    p.corona = Math.min(1, p.corona + ENRAGED.corona);
  }
  return p;
}

/** where its pupil is on the stage now, where its lances of sight leave the eye */
export function unblinkingPupil(e: Enemy, t: number): [number, number] {
  const p = unblinkingPose(e, t);
  return [e.x + p.lookX, e.y + BALL.y + p.lookY];
}
