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
export type CueWord = "evade" | "perfect";
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
/** play runs the simulation; skills pauses it under the skill tree; clear is the end of the stage */
export type GameMode = "play" | "skills" | "clear";

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
  /** fight while a wave is on; once it is clear, count down to the skill tree, then to the next wave */
  lull: "fight" | "toSkills" | "toNext";
  waveTimer: number;
  kills: number;
  /** the furthest wave reached in this browser */
  best: number;
  enemies: Enemy[];
  fx: Effect[];
  ghosts: Ghost[];
  pickups: Pickup[];
  blazes: Blaze[];
  numbers: DamageNumber[];
  spell: number;
  swing: number;
  banner: { text: string; time: number };
}
