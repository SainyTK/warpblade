export type EnemyType = "wisp" | "husk";
export type EnemyState = "drift" | "walk" | "wind" | "lunge" | "swipe" | "recover";

export interface Enemy {
  type: EnemyType;
  /** wisp: body center. husk: feet. */
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
  flash: number;
  frozen: number;
  burn: number;
  burnTick: number;
  shock: number;
  seed: number;
  /** the last sword swing that hit it, so one swing hits once */
  swing: number;
  /** which side of the hero a wisp circles to */
  side: number;
}
