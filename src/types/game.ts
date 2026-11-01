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
/** an afterimage left by a warp or a dodge */
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

export interface GameState {
  t: number;
  /** hit-stop: the simulation is frozen while this is above 0 */
  freeze: number;
  shake: number;
  amp: number;
  /** sky flash after lightning */
  flash: number;
  wave: number;
  kills: number;
  best: number;
  waveTimer: number;
  enemies: Enemy[];
  fx: Effect[];
  ghosts: Ghost[];
  pickups: Pickup[];
  blazes: Blaze[];
  spell: number;
  swing: number;
  banner: { text: string; time: number };
}
