import type { HitFeel } from "../../types/move";
import { frame } from "../hero";

/** Sable's crossbow bolts: how they fly, what they deal and how fast she looses them */
export const BOLT = {
  /** bolts the quiver holds before a reload: three full strings */
  quiver: 9,
  /** pixels a second */
  speed: 430,
  /** pixels a bolt flies before it drops away */
  range: 250,
  /** damage as a multiple of attack damage */
  power: 1.11,
  /** a primed bolt (a perfect reload's, a kick's, a slide's or a hop's) deals this much more */
  primedBonus: 0.35,
  /** foes a bolt passes through before it stops, before Piercing Bolts */
  pierce: 0,
  /** the hop back's free bolt deals this share of a normal bolt */
  hopShare: 0.685,
  /** side bolts of a fan spread this far apart, in radians */
  fanSpread: 0.14,
  /** knockback of one bolt: it eases the foe back along the line of fire, so a string keeps her range */
  kx: 55,
  ky: -15,
  /** the stagger of a bolt outside the string's beats: the hop's, a fan's side bolts and copies */
  stagger: 0.18,
  /** pixels of shaft drawn behind the head */
  shaft: 9,
  /** a stuck bolt stays in the floor this long */
  stuck: 0.6,
} as const;

/** the string: bolts in a row before the crossbow cocks again, the last one a closing bolt */
export const STRING = {
  /** the closing bolt's damage as a multiple of attack damage, and its push multiple */
  closingPower: 2.1,
  closingPush: 2,
  /** foes the closing bolt passes through before it stops */
  closingPierce: 1,
  /** bolts in one airtime with no skill, the last a closing bolt */
  air: 2,
} as const;

/** where the bolt leaves the crossbow, pixels from her feet facing right, for each aim */
export const MUZZLE = {
  level: { x: 13, y: -18 },
  up: { x: 11, y: -24 },
  /** kneeling on the floor */
  low: { x: 13, y: -11 },
  /** slanted down in the air */
  air: { x: 11, y: -14 },
} as const;

/**
 * A bolt bends toward the foe nearest the aim: within `cone` radians of it at range, widening to `closeCone` for a foe
 * `close` pixels away or nearer, so a flier right over her can still be shot.
 */
export const AIM_ASSIST = { cone: 0.6, closeCone: 1.35, close: 70 } as const;

/**
 * The aim picks itself from the foe it is going for: a foe from `up` radians above to `down` below the level counts,
 * one steeper than `upStance` above takes the up stance, and on the floor one whose middle is `kneel` pixels below the
 * level muzzle takes the kneeling shot. In the air a foe lower than `airLevel` radians takes the slanted shot.
 */
export const AIM_PICK = { up: -1.05, down: 0.7, upStance: -0.3, kneel: 3, airLevel: 0.25 } as const;

/** the angle of each aim in radians, positive down */
export const AIM_ANGLE = { level: 0, up: -0.5, low: 0, air: 0.62 } as const;

/** one beat of the string: when the bolt leaves in its clip and how long the clip runs at attack speed 1, the seconds a
 *  minion it strikes staggers, the pitch of the string's snap and the hit feel (hit-stop in real seconds) */
interface Beat {
  fire: number;
  dur: number;
  stagger: number;
  twang: number;
  feel: HitFeel;
}

/**
 * The string's beats, first bolt to closing bolt. Each bolt's stagger outlasts the gap to the next bolt's hit, and the
 * closing bolt's holds the foe through the cock and the next string's first draw. The hit feel grows through the string.
 */
export const BEATS: readonly Beat[] = [
  { fire: frame(4), dur: frame(7), stagger: 0.36, twang: 1.9, feel: { stop: 0.035, shake: [0.06, 0.8], pitch: 1.35 } },
  { fire: frame(4), dur: frame(7), stagger: 0.4, twang: 1.75, feel: { stop: 0.045, shake: [0.08, 1.1], pitch: 1.2 } },
  { fire: frame(4), dur: frame(7), stagger: 0.62, twang: 1.45, feel: { stop: 0.075, shake: [0.16, 2], pitch: 0.9 } },
];

/** a primed bolt lands at least this hard, and a bolt off the string's beats sounds at this pitch */
export const PRIMED_FEEL: HitFeel = { stop: 0.03, shake: [0.08, 1], pitch: 1.3 };

/** seconds at attack speed 1 the crossbow cocks after a closing bolt, before the next string may start */
export const COCK = frame(6);
