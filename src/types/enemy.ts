/** night foes, the bosses, and the foes of each era: day, rain, twilight and abyss */
export type EnemyType =
  | "wisp"
  | "husk"
  | "brute"
  | "warden"
  | "thornback"
  | "moth"
  | "oakheart"
  | "mire"
  | "stormkite"
  | "boghulk"
  | "golem"
  | "sprite"
  | "stalker"
  | "eye"
  | "maw"
  | "sovereign"
  | "unblinking";
export type EnemyState =
  | "drift"
  | "walk"
  | "wind"
  | "lunge"
  | "swipe"
  | "recover"
  | "leap"
  | "volley"
  | "summon"
  | "dive"
  /** free states for era foes to use as they like */
  | "charge"
  | "hop"
  | "shoot"
  | "blink"
  | "burrow"
  | "beam";
/** minions come in waves, a mini boss every fifth wave, bosses at waves 20 and 30 and one more after the last wave */
export type EnemyRank = "minion" | "mini" | "boss";

export interface Enemy {
  type: EnemyType;
  rank: EnemyRank;
  /** wisp and warden: body center. husk and brute: feet. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  max: number;
  state: EnemyState;
  st: number;
  cd: number;
  face: number;
  /** how long the hero has been on the side it is not facing */
  turn: number;
  flash: number;
  frozen: number;
  burn: number;
  burnTick: number;
  /** in a co-op room, a mark for the hero who set it burning; null in solo play */
  burner: object | null;
  shock: number;
  /** knocked down or tripped: cannot act */
  stun: number;
  /** launched into the air: falls under gravity, cannot act, takes double damage */
  air: boolean;
  airTime: number;
  seed: number;
  /** the last sword swing of each hero that hit it, by place in a co-op room (0 in solo play), so one swing hits once
   *  and two heroes swinging at once do not undo each other */
  swings: number[];
  /** which side of the hero a wisp circles to */
  side: number;
  /** scales its damage with the wave */
  power: number;
  xp: number;
  /** an elite: more HP, a gold glint, and a chest when it falls */
  elite: boolean;
  /** seconds left slowed by a skill's cold */
  chill: number;
  /** stacking damage over time from skills (poison, bleed, burn, lodged bolts), one entry per skill id */
  stacks: SkillStacks[];
  /** skill marks, one per source: each adds its share of extra damage from every source while it lasts */
  marks: FoeMark[];
  /** boss phase: 1, or 2 once it is enraged */
  phase: number;
  /** frontal blows blocked in a row; the next one breaks the guard */
  guardHits: number;
  /** hits taken while airborne: each holds it up less */
  airHits: number;
  /** time before a wisp can slip away from a swing again */
  evadeCd: number;
  /** staggered by a hero's blow for this long: its action is cut and it cannot act (game/enemies/stagger.ts) */
  stagger: number;
  /** blows in a row it has staggered for, and seconds since the last stagger ended */
  staggerHits: number;
  staggerIdle: number;
  /** braced after too many staggers in a row: it cannot be staggered for this long */
  brace: number;
  /** its feet are held for this long (burning ground, a brand): a walker stops walking and does not hurt by touch */
  halt: number;
  /** pinned to the floor for this long (Ysra's Impale and hook): held still; the damage it takes more is a mark */
  pinned: number;
  /** blinded for this long (Tallis's Smoke Knot): it neither turns nor starts a wind-up at a hero (game/enemies/awareness.ts) */
  blind: number;
  /** stopped in time for this long (Mirel's Stopped Clock and Hour of Stillness): it does not move, act or fall */
  stopped: number;
  /** damage it took while stopped, and the share of it that lands again as one hit when it restarts (0 for none) */
  stopStore: number;
  stopShare: number;
  /** free scratch values for a foe's own behavior: a target, a timer, a charge count */
  ax: number;
  ay: number;
  n: number;
}

/** one skill's stacks on a foe: each stack deals `damage` every `every` seconds until `left` runs out */
/** one skill's mark on a foe: seconds left, and the share of extra damage it adds (0.2 is +20%) */
export interface FoeMark {
  source: string;
  left: number;
  bonus: number;
}

export interface SkillStacks {
  /** the skill's id: the ticks' damage source */
  source: string;
  stacks: number;
  max: number;
  /** damage of one stack's tick, before Might, Flow and a mark */
  damage: number;
  every: number;
  /** seconds until the next tick */
  next: number;
  /** seconds left; each new stack refreshes it */
  left: number;
  /** in a co-op room, a mark for the hero who laid the stacks; null in solo play */
  owner: object | null;
}
