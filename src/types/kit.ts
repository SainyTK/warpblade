import type { Enemy } from "./enemy";
import type { Hero } from "./hero";
import type { MoveHit, MoveId, Situation } from "./move";
import type { Pose } from "./pose";

/** which hero's controls, moves and states drive the shared rig */
export type KitId = "kael" | "ysra" | "sable" | "hulda" | "orrin" | "mirel" | "wenna";

/**
 * How one hero plays. The shared loop (updateHero, the combo engine, physics, hurt) calls into the kit of the hero
 * being played, so each hero owns its own presses, combo choices, states and poses.
 *
 * Every shop item helps every hero, so a kit also keeps these promises (see docs/meta-progress.md): it calls
 * `travelEnded()` (src/game/hero/travelEnd.ts) when each of its travel moves ends, deals its damage from
 * `progress.stats.ad` and `progress.stats.ap`, spends stamina on its defence or travel and MP on the shared ultimate,
 * walks at `progress.stats.move` and lets blows reach `hurtHero`, where Last Light answers a fatal one.
 */
export interface HeroKit {
  /** timers of the kit's own state, every frame before presses are read */
  tick(dt: number): void;
  /** use waiting presses: walk direction and a double tap toward a side (0 when none) */
  readActions(dir: number, tap: number): void;
  /** the combo move J starts now, from what is around the hero; null when the combo cannot go on */
  chooseMove(s: Situation): MoveId | null;
  /** run the kit's own states; false hands the state to the shared runner */
  runState(dt: number): boolean;
  /** the pose for the kit's own states and its own free-state look; null uses Kael's shared clips */
  pose(h: Hero, t: number): Pose | null;
  /** after a combo move's blow, with how many foes it hit */
  afterStrike(id: MoveId, hits: number): void;
  /** a combo move's blow as the kit's skills shape it (power, reach, guard break); left out, the move's own */
  shapeHit?(id: MoveId, hit: MoveHit): MoveHit;
  /** seconds after a blow lands that a J press is Keen; left out, `KEEN.window` */
  keenWindow?(): number;
  /** every move starts Keen right now, whatever the timing */
  alwaysKeen?(): boolean;

  /** a blow is about to land on the hero: true when the kit took it (a block or a parry) */
  absorbHurt(dmg: number, fromX: number): boolean;
  /** combo moves play this much faster on top of attack speed, right now */
  attackRate?(): number;
  /** the walk speed right now, given the shared one: a kit's own drift or boost; left out, the shared speed */
  walkSpeed?(speed: number): number;
  /** ground covered by one full stride of the walk or run clip, in pixels; left out, the stride keeps the old pace */
  stride?(running: boolean): number;
  /** damage taken is multiplied by this */
  hurtScale(): number;
  /** every hit the hero deals, from any source, is multiplied by this (a buff of the kit's own); left out, 1 */
  damageScale?(): number;
  /**
   * A blow has taken its HP and the hero still stands: true when the kit's armour takes the blow instead of the hurt
   * state, so the knockback, the flinch and the combo reset are skipped. Left out, every blow hurts as usual.
   */
  steadfast?(): boolean;
  /** the kit drives the hero's horizontal speed itself this frame (vaults, dives, charges) */
  drivesMotion(): boolean;
  /** gravity multiplier for the kit's own states; 1 for shared behaviour */
  gravityScale(): number;
  /** drawn in the world behind the hero, for parts of the kit that reach past the sprite (a chain's anchor) */
  drawBack?(): void;
  /** drawn in the world over the hero, for parts of the kit that reach past the sprite (a chain and its hook) */
  draw?(): void;
  /** a foe fell to a hit of this hero's (any source of theirs), with the hero swapped in: a kit's own drops or counts */
  onKill?(e: Enemy): void;
  /** a fresh run */
  reset(): void;
}
