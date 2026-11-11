import { PACE } from "../stage";

/** real beats a minute at each Groove tier: 1, 2, 3 and Crescendo */
export const TEMPO_BPM = [96, 108, 120, 132] as const;

/**
 * His beat: how near a judged press must fall to the nearest beat, before or after, in game seconds. A real tenth of a
 * second, wider with Steady Hand; a guest seat in a room is judged a little wider and against the beat shifted later
 * by the time its keys take to reach the host (the room measures no round trip, so a fixed 0.12 s).
 */
export const BEAT = {
  window: 0.1 * PACE,
  steadyWindow: 0.18 * PACE,
  guestWindow: 0.14 * PACE,
  guestLag: 0.12 * PACE,
  /** a bar has four beats; its first is the downbeat */
  bar: 4,
  /** the floor ring closes from this width to this one over each beat, in art pixels, and flashes on the beat */
  ringFrom: 26,
  ringTo: 14,
  ringHeight: 3,
  /** game seconds the ring and the GV bar's lamp flash on each beat */
  flash: (2 / 30) * PACE,
} as const;

/** Groove, the GV bar: built only by pressing on the beat, and it sets his tempo */
export const GROOVE = {
  max: 12,
  /** an on-beat judged press, an off-beat one, and a blow that takes his HP */
  onBeat: 1,
  offBeat: -3,
  hurt: -4,
  /** while a foe stands, every beat after this many with no judged press costs one */
  silence: 4,
  /** the first Groove of each tier: 2 at 4, 3 at 8, Crescendo at 12 */
  tiers: [0, 4, 8, 12],
  /** seconds a lost pip blinks grey */
  blink: 0.2,
} as const;
