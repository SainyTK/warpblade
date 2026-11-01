import { MAX_HP, MAX_MP } from "../constants/combat";
import { STAND } from "../constants/hero";
import { GROUND, SEED } from "../constants/stage";
import { Lights } from "../engine/lights";
import { Particles } from "../engine/particles";
import type { GameState } from "../types/game";
import type { Hero } from "../types/hero";
import { Rng } from "../utils/rng";
import { Chain } from "./hero/chain";

/** The one owner of everything that changes while playing. */
export const rng = new Rng(SEED);
export const particles = new Particles(rng);
export const lights = new Lights();

export const game: GameState = {
  t: 0,
  freeze: 0,
  shake: 0,
  amp: 0,
  flash: 0,
  wave: 0,
  kills: 0,
  best: 0,
  waveTimer: 2,
  enemies: [],
  fx: [],
  ghosts: [],
  pickups: [],
  blazes: [],
  spell: 0,
  swing: 0,
  banner: { text: "", time: 0 },
};

export const hero: Hero = {
  x: 70,
  y: GROUND,
  vx: 0,
  vy: 0,
  face: 1,
  ground: true,
  state: "idle",
  st: 0,
  runPhase: 0,
  combo: 0,
  queued: false,
  hp: MAX_HP,
  mp: MAX_MP,
  inv: 0,
  jumps: 0,
  dodgeCd: 0,
  drop: 0,
  anchor: null,
  hasSword: true,
  hitDone: false,
  cutShort: false,
  pose: STAND,
  hand: [6, -15],
  ghostTimer: 0,
  sword: null,
  warpTarget: null,
};
export const scarf = new Chain(8, 2.2, 340);
export const ponytail = new Chain(4, 2, 300);

particles.onLand = (x, y) => game.blazes.push({ x, y, life: 1.6, max: 1.6, tick: 0 });

export function showBanner(text: string, seconds: number): void {
  game.banner = { text, time: seconds };
}
