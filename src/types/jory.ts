import type { Enemy } from "./enemy";

/** states only Jory enters; his kit runs and poses them */
export type JoryState = "mallet" | "downstroke" | "boom" | "beatStep" | "abilityCast" | "spellCast" | "drumroll";

/** the blows of his mallet string, Kick Drum's front kick, and Downstroke in the air */
export type MalletBlow = "tap" | "roll" | "crash" | "kick" | "downstroke";

/** the abilities on I, in the order O turns through them: his two from the start and his three spell skills */
export type JoryAbility = "steadyHand" | "thunderSkin" | "j_gong" | "j_tuning" | "j_echo";

/** the presses his beat judges */
export type BeatButton = "J" | "K" | "L" | "I";

/** a judged press: on the beat or off it */
export interface BeatJudgement {
  onBeat: boolean;
  /** the press fell on a bar's downbeat (every fourth beat) */
  downbeat: boolean;
}

/**
 * What Jory's kit remembers between frames, one copy per player. The guest's HUD reads Groove, the beat and the
 * abilities, and his sprite on every screen rides the beat from it.
 */
export interface JoryMemory {
  /** game seconds since the last beat, the length of the beat under way, and beats played this run */
  phase: number;
  beatLen: number;
  beats: number;
  /** beat-clock seconds since the run started, which stamps each press */
  clock: number;
  /** Groove, a whole number from 0 to 12 */
  groove: number;
  /** seconds left of the GV bar's grey blink, and the pips shown before the loss */
  lostBlink: number;
  lostFrom: number;
  /** beats since the last judged press, for the silence decay */
  silent: number;
  /** on-beat presses in a row (Iron Metronome) and in all this run (Standing Ovation) */
  streak: number;
  onBeats: number;
  /** the beat-clock time each judged button was first seen pressed, -1 when no press waits */
  stampJ: number;
  stampK: number;
  stampL: number;
  stampI: number;
  /** the mallet string: the blow under way or the one the next J starts (index), which blow it is, and its timing */
  blow: number;
  current: "tap" | "roll" | "crash" | "kick" | "downstroke";
  queued: boolean;
  /** the press that queued the next blow was on the beat */
  queuedAccent: boolean;
  queuedDownbeat: boolean;
  /** the blow under way is an Accent, and was started on a downbeat */
  accent: boolean;
  downbeat: boolean;
  /** hits of the blow under way already dealt (Roll strikes twice) */
  hits: number;
  /** beat-clock time of the blow's hit frame; a J pressed before it counts as off the beat */
  struckAt: number;
  link: number;
  /** Downbeat Leap: jumps left in this airtime */
  leaps: number;
  /** Downstrokes left in this airtime, and the air step */
  downstrokes: number;
  airStep: boolean;
  /** Boom: its wait, the untouchable moment of an on-beat Boom, whether it was on the beat, and its perfect dodge */
  boomWait: number;
  boomGuard: number;
  boomOnBeat: boolean;
  boomDodged: boolean;
  /** Beat Step: its wait, direction, length, whether it was on the beat, and its perfect dodge */
  stepWait: number;
  stepDir: number;
  stepLen: number;
  stepOnBeat: boolean;
  stepDodged: boolean;
  /** Moonwalk: on-beat steps left that cost no stamina */
  freeSteps: number;
  /** Steady Hand: beats left */
  steadyBeats: number;
  /** seconds until each ability on I can be used again */
  steadyCd: number;
  thunderCd: number;
  gongCd: number;
  tuningCd: number;
  echoCd: number;
  /** the ability the cast under way is using, and whether its press was on the beat */
  casting: JoryAbility;
  castOnBeat: boolean;
  /** the special or ultimate under way: its level, rings in all and rings played, and seconds since the last ring */
  ultLevel: number;
  rings: number;
  rung: number;
  ringT: number;
  /** Grand Finale holds Crescendo for this many more beats */
  lockBeats: number;
  /** seconds held at Crescendo without a break, and the most this run (In Time) */
  crescendoT: number;
  crescendoBest: number;
  /** HP seen last step, so a blow that takes HP costs Groove */
  lastHp: number;
  /** Encore: seconds until the next free blow at Crescendo */
  shrugCd: number;
}

/** what the host alone keeps for Jory: foes his kit holds on to, which never go to a guest */
export interface JoryHostMemory {
  /** the last foe a blow landed on */
  lastFoe: Enemy | null;
  /** the ground foes the Beat Step under way has passed through */
  passed: Enemy[];
}

declare module "./skillBehavior" {
  /** Jory's own skill events */
  interface SkillEvents {
    /** a judged press: on the beat or off it, which button, and Groove after it */
    beat: { onBeat: boolean; button: BeatButton; groove: number; downbeat: boolean };
    /** an Accent landed on this foe, from this blow */
    accent: { foe: Enemy; blow: MalletBlow; downbeat: boolean };
    /** a Boom struck, on the beat or not, and the foes in its ring */
    boom: { onBeat: boolean; foes: Enemy[] };
    /** his Groove tier changed */
    tier: { from: number; to: number };
    /** a beat of his clock went by */
    tick: { beats: number; downbeat: boolean };
  }
}
