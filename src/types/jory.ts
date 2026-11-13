import type { Enemy } from "./enemy";
import type { HeroState } from "./hero";

/** states only Jory enters; his kit runs and poses them */
export type JoryState = "mallet" | "downstroke" | "boom" | "abilityCast" | "spellCast" | "drumroll";

/** the blows of his mallet string, Kick Drum's front kick, and Downstroke in the air */
export type MalletBlow = "tap" | "roll" | "crash" | "kick" | "downstroke";

/** the abilities on I, in the order O turns through them: his three from the start and his three spell skills */
export type JoryAbility = "boom" | "steadyHand" | "thunderSkin" | "j_gong" | "j_tuning" | "j_echo";

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
  /** the beat-clock time each judged button went down, -1 when its key is up and no press of it waits */
  stampJ: number;
  stampK: number;
  stampL: number;
  stampI: number;
  /** the beat-clock time of each button's latest press, kept after it is used, for the presses the shared moveset takes */
  lastJ: number;
  lastK: number;
  lastL: number;
  lastI: number;
  /** the hero state seen last step, so the kit hears a warp or a dodge start */
  seen: HeroState;
  /** the warp under way was thrown on the beat, and on a bar's downbeat: its arrival is an Accent */
  warpOnBeat: boolean;
  warpDownbeat: boolean;
  /** the dodge under way went on the beat */
  dodgeOnBeat: boolean;
  /** a J judged during the flinch and kept waiting to start a blow: its stamp (-1 for none) and its judgement */
  keptJ: number;
  keptOnBeat: boolean;
  keptDownbeat: boolean;
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
  /** Downstrokes left in this airtime */
  downstrokes: number;
  /** Boom: its recharge, the untouchable moment of an on-beat Boom, whether it was on the beat, and its perfect dodge */
  boomWait: number;
  boomGuard: number;
  boomOnBeat: boolean;
  boomDodged: boolean;
  /** Steady Hand: beats left */
  steadyBeats: number;
  /** seconds until each ability on I can be used again */
  steadyCd: number;
  thunderCd: number;
  gongCd: number;
  tuningCd: number;
  echoCd: number;
  /** the ability the cast under way is using, whether its press was on the beat, and whether it is the wide form */
  casting: JoryAbility;
  castOnBeat: boolean;
  castWide: boolean;
  /** the Drumroll under way: its level, rings in all and rings played, and seconds since the last ring */
  ultLevel: number;
  rings: number;
  rung: number;
  ringT: number;
  /** Drumroll's upgrade holds Crescendo for this many more beats */
  lockBeats: number;
  /** seconds held at Crescendo without a break, and the most this run (In Time) */
  crescendoT: number;
  crescendoBest: number;
  /** HP seen last step, so a blow that takes HP costs Groove */
  lastHp: number;
  /** Encore: seconds until the next free blow at Crescendo */
  shrugCd: number;
}

declare module "./skillBehavior" {
  /** Jory's own skill events */
  interface SkillEvents {
    /** a judged press: on the beat or off it, which button, and Groove after it */
    beat: { onBeat: boolean; button: BeatButton; groove: number; downbeat: boolean };
    /** an Accent landed on this foe, from this blow */
    accent: { foe: Enemy; blow: MalletBlow; downbeat: boolean };
    /** a Boom struck (his ability on I, or Counterbeat from a parry), on the beat or not, and the foes in its ring */
    boom: { onBeat: boolean; foes: Enemy[] };
    /** a blow from this foe was blocked on his drum */
    drumBlock: { foe: Enemy };
    /** his Groove tier changed */
    tier: { from: number; to: number };
    /** a beat of his clock went by */
    tick: { beats: number; downbeat: boolean };
  }
}
