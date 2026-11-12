import { frame } from "../hero";

/** K: Frenzy, the axe edge drawn across his forearm */
export const FRENZY = {
  /** HP it costs, as a share of max HP */
  cost: 0.12,
  /** the activation, the Frenzy itself and the wait after it */
  cast: 0.25,
  time: 4,
  wait: 2,
  /** attack rate it adds, and the multiple on each repay in it */
  rate: 0.2,
  repay: 1.5,
  /** red steam from his mouth every this many seconds */
  breath: 0.4,
  sparks: 8,
} as const;

/** L: Hunt, a low lunge at the nearest ground foe ahead that ends in a chop */
export const HUNT = {
  stamina: 20,
  wait: 0.6,
  /** the crouch before it leaves, its speed (times move speed), how far it looks for a foe, and how short of it it lands */
  load: frame(2),
  speed: 380,
  reach: 110,
  /** lands this far short of the quarry's middle: outside a walker's touch (its 12 px half-width and his 5) and well
   *  inside the chop's 26 px reach */
  short: 24,
  /** a mini boss or boss winding up is met this far short instead, past the longest slam in the game (64 px from its
   *  middle, and his own 5), and the chop is held */
  wary: 72,
  /** with no foe ahead it travels this far */
  bare: 56,
  /** how high over the floor the lunge carries him, drawn only */
  lift: 8,
  /** the chop's recovery */
  recover: 0.2,
  /** Headlong, the dive from the air: 45 degrees down and ahead at this speed */
  diveSpeed: 420,
} as const;

/** I: War Cry, a roar that staggers and marks the foes round him */
export const WAR_CRY = {
  cost: 0.08,
  cooldown: 10,
  radius: 64,
  ap: 0.5,
  ad: 0.2,
  stagger: 0.5,
  mark: { seconds: 6, bonus: 0.2 },
} as const;

/** I: Red Crescent, an overhead swing that throws a crescent of blood along the floor */
export const RED_CRESCENT = {
  cost: 0.1,
  cooldown: 4,
  reach: 150,
  speed: 280,
  ad: 0.9,
  ap: 0.6,
  height: 14,
} as const;

/** the cast clips: War Cry's roar, Red Crescent's overhead swing, and the spell skills' shared cast */
export const CRY_CAST = { dur: frame(12), hit: frame(4) } as const;
export const CRESCENT_CAST = { dur: frame(14), hit: frame(7) } as const;
export const SPELL_CAST = { dur: frame(12), hit: frame(5) } as const;
export const FRENZY_CAST = { dur: frame(8), hit: frame(4) } as const;

/** U: Berserk */
export const BERSERK = {
  /** the roar: how long he is untouchable in it, its ring, and how far minions are pushed out */
  roar: 0.35,
  ring: 48,
  push: 56,
  /** seconds of Berserk by charge level */
  time: [3, 4, 5, 7],
  /** attack rate it adds, and the multiple on each repay in it */
  rate: 0.4,
  repay: 2,
  /** the share the scene's edges are tinted crimson */
  tint: 0.15,
  /** Last Cleave: its ring by charge level, the share of the level's power times attack damage plus ability power */
  rings: [60, 80, 100, 130],
  share: 0.3,
  /** the spin's clip, its hit frame, and the shake */
  spin: frame(16),
  spinHit: frame(6),
  shake: 4,
} as const;

/** ground covered by one full stride of his walk: a heavy, rolling step */
export const BRANNOC_STRIDE = 27;
