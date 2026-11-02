export type EnemyType = "wisp" | "husk" | "brute" | "warden";
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
  | "dive";
/** minions come in waves, a mini boss every fifth wave, bosses at waves 20 and 30 */
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
  shock: number;
  /** knocked down or tripped: cannot act */
  stun: number;
  /** launched into the air: falls under gravity, cannot act, takes double damage */
  air: boolean;
  airTime: number;
  seed: number;
  /** the last sword swing that hit it, so one swing hits once */
  swing: number;
  /** which side of the hero a wisp circles to */
  side: number;
  /** scales its damage with the wave */
  power: number;
  xp: number;
  /** boss phase: 1, or 2 once it is enraged */
  phase: number;
  /** frontal blows blocked in a row; the second one sets off a counter */
  guardHits: number;
  /** hits taken while airborne: each holds it up less */
  airHits: number;
  /** Static Step's mark: the next sword hit sends lightning from it */
  charged: number;
  /** time before a wisp can slip away from a swing again */
  evadeCd: number;
  /** a husk rocked by a sword blow stops walking for this long; a wind-up already started goes on */
  stagger: number;
}
