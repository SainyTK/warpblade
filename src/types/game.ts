import type { Effect } from "./effect";
import type { Enemy } from "./enemy";
import type { SpriteImage } from "./sprite";

export interface Pickup {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  kind: "mp" | "hp";
  done?: boolean;
}
/** a coin dropped by a foe: it falls and bounces, then flies to Kael */
export interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  /** lying on a floor */
  rest: boolean;
  done?: boolean;
}
/** experience dropped by a slain foe: it falls and bounces like a coin, Kael picks it up by touch, and any left fly to him later */
export interface XpOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  /** experience it gives */
  value: number;
  /** lying on a floor */
  rest: boolean;
  done?: boolean;
}
/** an afterimage left by a warp or a dash */
export interface Ghost {
  s: SpriteImage;
  x: number;
  y: number;
  flip: boolean;
  life: number;
  max: number;
}
/** a small fire left on the floor */
export interface Blaze {
  x: number;
  y: number;
  life: number;
  max: number;
  tick: number;
}
export type DamageTag = "normal" | "crit" | "back" | "air" | "burn" | "block" | "break" | "shatter";
/** a word that pops without a number */
export type CueWord = "evade" | "perfect" | "parry" | "broken";
/** a number that pops out of a struck foe */
export interface DamageNumber {
  x: number;
  y: number;
  vy: number;
  value: number;
  tag: DamageTag | CueWord;
  /** seconds since it popped */
  age: number;
  big: boolean;
  life: number;
}
/** play runs the simulation; pick pauses it while Kael chooses a skill when a wave is cleared with skill points waiting;
 *  chest pauses it while an opened chest shows what it gave; clear is the end of the stage */
export type GameMode = "play" | "pick" | "chest" | "clear";

export interface GameState {
  mode: GameMode;
  t: number;
  /** hit-stop: the simulation is frozen while this is above 0 */
  freeze: number;
  shake: number;
  amp: number;
  /** sky flash after lightning */
  flash: number;
  /** slow motion after a perfect dodge: the world runs slow while Kael does not */
  slow: number;
  stage: number;
  wave: number;
  /** fight while a wave is on; once it is clear, count down to the next wave */
  lull: "fight" | "toNext";
  waveTimer: number;
  kills: number;
  /** the furthest wave reached in this browser */
  best: number;
  /** coins picked up this run, banked when it ends */
  coins: number;
  coinDrops: Coin[];
  xpOrbs: XpOrb[];
  /** Last Light has been spent this run */
  revived: boolean;
  enemies: Enemy[];
  fx: Effect[];
  ghosts: Ghost[];
  pickups: Pickup[];
  blazes: Blaze[];
  numbers: DamageNumber[];
  /** the element Kael casts with I, an index into ELEMENTS; each co-op player keeps their own */
  spell: number;
  /** the last swing number handed out, to any hero */
  swing: number;
  banner: { text: string; time: number };
}
