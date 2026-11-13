import { frame } from "../hero";

/** I: Frenzy, the axe edge drawn across his forearm, his first ability */
export const FRENZY = {
  /** HP it costs, as a share of max HP */
  cost: 0.12,
  /** seconds the Frenzy lasts, and the wait after it ends before I can start it again */
  time: 4,
  wait: 2,
  /** attack rate it adds, and the multiple on each repay in it */
  rate: 0.2,
  repay: 1.5,
  /** red steam from his mouth every this many seconds */
  breath: 0.4,
  sparks: 8,
} as const;

/** J held: the Hunt, his warp. The great axe bites into the foe, he leaps after it and rips it out with a chop */
export const HUNT = {
  /** the axe ripped out of the foe wins back this share of max HP from the debt, on top of the chop's own repay */
  repay: 0.05,
  /** how far in front of him a foe Headlong drags in is left */
  drag: 18,
} as const;

/** K: his guard. He takes a blow on the haft and bleeds through it: a poor block, and the strongest parry reward */
export const BRANNOC_GUARD = {
  /** half a blocked blow still reaches him, and each block costs this much stamina */
  chip: 0.5,
  blockCost: 25,
} as const;

/** a parry's Blood Answer: the whole debt comes back at once and Frenzy starts for free for this many seconds */
export const BLOOD_ANSWER = {
  frenzy: 3,
  /** the crimson burst round him */
  ring: 30,
  sparks: 14,
} as const;

/** I held: the wide form of War Cry and Red Crescent costs this many times the HP */
export const WIDE_HP = 1.5;

/** I: War Cry, a roar that staggers and marks the foes round him; held, it reaches `wide` times as far */
export const WAR_CRY = {
  cost: 0.08,
  cooldown: 10,
  radius: 64,
  wide: 1.6,
  ap: 0.5,
  ad: 0.2,
  stagger: 0.5,
  mark: { seconds: 6, bonus: 0.2 },
} as const;

/** I: Red Crescent, an overhead swing that throws a crescent of blood along the floor; held, one each way */
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
