import type { HitFeel } from "../../types/move";
import { frame } from "../hero";

/**
 * Seconds after each skill blow of the ground string before the next may cut in. With the next blow's wind-up this
 * keeps the string's tempo: about 0.45 real seconds from the sweep or the phase cut landing to the next blow, and about
 * 0.5 from the crescent turn's cut behind to the smash. The finishers use `STRING_CANCEL.finisher`.
 */
export const SKILL_CANCEL = { sweep: 0.12, crescentTurn: 0.08, phaseCut: 0.06 } as const;

/**
 * Hit-stop, shake and sound of each skill blow, matched to the place in the string it takes: the sweep a little heavier
 * than the step cut it replaces, the crescent turn's two cuts like the twin fang's stabs, the phase cut the heaviest of
 * the 3rd hits, and the hop cleave and Skybreaker's launch as heavy as the smash.
 */
export const SKILL_FEEL = {
  sweep: { stop: 0.07, shake: [0.12, 1.4], pitch: 1 },
  crescentFront: { stop: 0.05, shake: [0.08, 1.1], pitch: 1.15 },
  crescentBack: { stop: 0.075, shake: [0.14, 1.8], pitch: 0.95 },
  phaseCut: { stop: 0.09, shake: [0.16, 2.2], pitch: 0.85 },
  hopCleave: { stop: 0.14, shake: [0.24, 3], pitch: 0.72 },
  skybreaker: { stop: 0.15, shake: [0.26, 3.2], pitch: 0.6 },
} as const satisfies Record<string, HitFeel>;

/** The whirlwind's three cuts, in front, behind and in front, each a little heavier than the one before. */
export const WHIRL_FEEL = [
  { stop: 0.04, shake: [0.06, 1], pitch: 1.3 },
  { stop: 0.045, shake: [0.07, 1.1], pitch: 1.2 },
  { stop: 0.065, shake: [0.12, 1.4], pitch: 1.05 },
] as const satisfies readonly HitFeel[];

/** The phase cut: the pass through the foe runs between these clip times, and Kael turns to face the foe at `turn`. */
export const PHASE = { from: frame(4), to: frame(5), turn: frame(7) } as const;

/**
 * The hop cleave leaves the floor at `off` and lands on `land`, its hit frame, carried forward at `speed` on the way: the
 * hop's height follows from gravity.
 */
export const HOP_CLEAVE = { off: frame(2), land: frame(8), speed: 70 } as const;

/**
 * Skybreaker slides in at `step` pixels a second through its crouch, then lifts Kael `rise` pixels as it lands and
 * throws the foe up at `launch`, so a J pressed in its follow-through starts the air string within reach of the foe.
 */
export const SKYBREAKER = { step: 150, rise: 40, launch: -330 } as const;

/** the meteor drop lands with this share of the stomp's power, for the longer tuck it now holds before the dive */
export const METEOR_POWER = 1.33;

/**
 * Reaping Sweep's drag stops a foe this many pixels from Kael's feet (or where it stood, if closer), holding that line
 * for `hold` seconds while it slides, so the sweep never pulls a foe past him.
 */
export const SWEEP_DRAG = { feet: 10, hold: 0.45 } as const;
