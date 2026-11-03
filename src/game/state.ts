import { KAEL } from "../constants/characters/kael";
import { STAND } from "../constants/hero";
import { GROUND, SEED } from "../constants/stage";
import { Lights } from "../engine/lights";
import { Particles } from "../engine/particles";
import { metaBonus } from "../store/meta";
import type { GameState } from "../types/game";
import type { Hero } from "../types/hero";
import type { Progress } from "../types/progress";
import { airLimit, comboLimit } from "../utils/progression";
import { Rng } from "../utils/rng";
import { computeStats } from "../utils/stats";
import { Chain } from "./hero/chain";

/** The one owner of everything that changes while playing. */
export const rng = new Rng(SEED);
export const particles = new Particles(rng);
export const lights = new Lights();
export const character = KAEL;

export const game: GameState = {
  mode: "play",
  t: 0,
  freeze: 0,
  shake: 0,
  amp: 0,
  flash: 0,
  slow: 0,
  stage: 1,
  wave: 0,
  lull: "toNext",
  waveTimer: 2,
  kills: 0,
  best: 0,
  coins: 0,
  coinDrops: [],
  xpOrbs: [],
  revived: false,
  enemies: [],
  fx: [],
  ghosts: [],
  pickups: [],
  blazes: [],
  numbers: [],
  spell: 0,
  swing: 0,
  banner: { text: "", time: 0 },
};

export function freshProgress(): Progress {
  const stats = computeStats(character, 1, {}, metaBonus());
  return {
    level: 1,
    xp: 0,
    picks: [],
    ranks: {},
    stats,
    perks: new Set(),
    ultimate: null,
    comboLimit: comboLimit(1, false),
    airLimit: airLimit({}),
  };
}
export const progress: Progress = freshProgress();

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
  running: false,
  hp: progress.stats.hp,
  mp: progress.stats.mp,
  stamina: progress.stats.stamina,
  staminaWait: 0,
  staminaFlash: 0,
  inv: 0,
  jumps: 0,
  drop: 0,
  anchor: null,
  hasSword: true,
  hitDone: false,
  cutShort: true,
  liftTop: GROUND,
  pose: STAND,
  hand: [6, -15],
  ghostTimer: 0,
  sword: null,
  warpTarget: null,
  move: null,
  lastMove: null,
  hitIndex: 0,
  chain: 0,
  queued: null,
  link: 0,
  comboCd: 0,
  airHits: 0,
  whirled: false,
  airDashed: false,
  sinceDash: 9,
  warpCd: 0,
  ultCd: 0,
  spellCd: { fire: 0, ice: 0, volt: 0 },
  spellCdFull: { fire: 1, ice: 1, volt: 1 },
  castElement: "fire",
  denied: { cast: 0, warp: 0, mp: 0, ult: 0 },
  spellPower: 1,
  lastHit: null,
  charge: 0,
  chargeLevel: 0,
  moveHits: 0,
  perfectUsed: false,
  riposte: 0,
  stabbed: false,
  keenOpen: 0,
  keenSpoiled: false,
  keenNext: false,
  keen: false,
  moveGhost: 0,
};
export const scarf = new Chain(8, 2.2, 340);
export const ponytail = new Chain(4, 2, 300);

/** at most this many fires burn on the floor at once */
const MAX_BLAZES = 24;
particles.onLand = (x, y) => {
  if (game.blazes.length < MAX_BLAZES) game.blazes.push({ x, y, life: 1.6, max: 1.6, tick: 0 });
};

export function showBanner(text: string, seconds: number): void {
  game.banner = { text, time: seconds };
}
