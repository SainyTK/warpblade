import { KAEL } from "../constants/characters/kael";
import { AIR_STRING } from "../constants/combo";
import { HERO_START_X } from "../constants/hero";
import { GROUND, SEED } from "../constants/stage";
import { ULT_COOLDOWN } from "../constants/ultimate";
import { Lights } from "../engine/lights";
import { Particles } from "../engine/particles";
import { metaBonus, metaToolBonus } from "../store/meta";
import type { CharacterDef } from "../types/character";
import type { GameState } from "../types/game";
import type { Hero } from "../types/hero";
import type { Progress } from "../types/progress";
import { freshBuild } from "../utils/build";
import { restPose } from "../utils/restPose";
import { Rng } from "../utils/rng";
import { computeStats } from "../utils/stats";
import { emptyStream } from "../utils/waves";
import { Chain } from "./hero/chain";
import { applySkin } from "./hero/skin";
import { objectMemory, rememberPerSeat } from "./seatMemory";

/** The one owner of everything that changes while playing. */
export const rng = new Rng(SEED);
export const particles = new Particles(rng);
export const lights = new Lights();
/** the hero being played; chosen on the hero screen before a run, and fixed for the run */
export let character: CharacterDef = KAEL;
/** the hero drawn on the stage: the one played, or in the menus the one looked at on the hero screen */
export let shown: CharacterDef = KAEL;
applySkin(KAEL.skin);

/** play as this hero from the next run on: their look now, their stats and skills when the run starts */
export function setCharacter(c: CharacterDef): void {
  character = c;
  shown = c;
  applySkin(c.skin);
}

/** choose this hero from a menu: as `setCharacter`, and standing at rest, since the menus show the hero before any
 *  frame of play has posed them */
export function chooseCharacter(c: CharacterDef): void {
  setCharacter(c);
  hero.pose = restPose(c.kit);
}

/** show this hero behind a menu without choosing it: drawn with its own look and kit, standing in its rest pose */
export function previewCharacter(c: CharacterDef): void {
  shown = c;
  applySkin(c.skin);
  hero.pose = restPose(c.kit);
}

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
  stream: emptyStream(),
  kills: 0,
  best: 0,
  coins: 0,
  coinDrops: [],
  xpOrbs: [],
  finale: "none",
  revives: 0,
  enemies: [],
  fx: [],
  ghosts: [],
  pickups: [],
  blazes: [],
  numbers: [],
  swing: 0,
  banner: { text: "", time: 0 },
};

/** a run's start: level 1, no skill held, the hero's special on U */
export function freshProgress(): Progress {
  return {
    level: 1,
    xp: 0,
    picks: 0,
    stats: computeStats(character, 1, [], metaBonus()),
    ultimate: character.special,
    comboLimit: character.comboHits,
    airLimit: AIR_STRING.hits,
    build: freshBuild(metaToolBonus()),
  };
}
export const progress: Progress = freshProgress();

/** a hero standing at the start, unhurt, with nothing remembered from an earlier run */
export function freshHero(stats: Progress["stats"]): Hero {
  return {
    x: HERO_START_X,
    y: GROUND,
    vx: 0,
    vy: 0,
    face: 1,
    ground: true,
    state: "idle",
    st: 0,
    runPhase: 0,
    running: false,
    hp: stats.hp,
    mp: stats.mp,
    stamina: stats.stamina,
    staminaWait: 0,
    staminaFlash: 0,
    inv: 0,
    jumps: 0,
    drop: 0,
    hasSword: true,
    hitDone: false,
    liftTop: GROUND,
    pose: restPose(character.kit),
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
    warpCd: 0,
    ultCd: 0,
    ultFull: ULT_COOLDOWN,
    spellCd: { lance: 0, burst: 0, fire: 0, ice: 0, volt: 0 },
    spellCdFull: { lance: 1, burst: 1, fire: 1, ice: 1, volt: 1 },
    castAbility: "lance",
    castWide: false,
    denied: { cast: 0, warp: 0, mp: 0, ult: 0, hp: 0 },
    spellPower: 1,
    lastHit: null,
    charge: 0,
    chargeLevel: 0,
    moveHits: 0,
    hitCount: 0,
    hitIdle: 0,
    perfectUsed: false,
    riposte: 0,
    riposteBlows: 0,
    keenOpen: 0,
    keenSpoiled: false,
    keenNext: false,
    keen: false,
    moveGhost: 0,
    swing: 0,
  };
}
export const hero: Hero = freshHero(progress.stats);
export const scarf = new Chain(8, 2.2, 340);
export const ponytail = new Chain(4, 2, 300);

/** what each player of a co-op room keeps for themselves; the drawn hand is copied since drawing hands back a shared pair */
const heroMemory = objectMemory(hero);
rememberPerSeat({ save: () => ({ ...hero, hand: [...hero.hand] }), load: heroMemory.load });
rememberPerSeat(objectMemory(progress));
rememberPerSeat(objectMemory(scarf, true));
rememberPerSeat(objectMemory(ponytail, true));
rememberPerSeat({
  save: () => ({ coins: game.coins, revives: game.revives }),
  load(saved) {
    Object.assign(game, saved);
  },
});
// afterimages hold whole sprite images: only the host draws them, and a guest's HUD never reads them
rememberPerSeat({
  hostOnly: true,
  save: () => ({ ghosts: game.ghosts }),
  load(saved) {
    Object.assign(game, saved);
  },
});

/** at most this many fires burn on the floor at once */
const MAX_BLAZES = 24;
particles.onLand = (x, y) => {
  if (game.blazes.length < MAX_BLAZES) game.blazes.push({ x, y, life: 1.6, max: 1.6, tick: 0 });
};

export function showBanner(text: string, seconds: number): void {
  game.banner = { text, time: seconds };
}
