import type { Hero } from "./hero";
import type { MoveId, Situation } from "./move";
import type { Pose } from "./pose";

/** which hero's controls, moves and states drive the shared rig */
export type KitId = "kael" | "ysra" | "sable";

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
  /** a blow is about to land on the hero: true when the kit took it (a block or a parry) */
  absorbHurt(dmg: number, fromX: number): boolean;
  /** combo moves play this much faster on top of attack speed, right now */
  attackRate?(): number;
  /** ground covered by one full stride of the walk or run clip, in pixels; left out, the stride keeps the old pace */
  stride?(running: boolean): number;
  /** damage taken is multiplied by this */
  hurtScale(): number;
  /** the kit drives the hero's horizontal speed itself this frame (vaults, dives, charges) */
  drivesMotion(): boolean;
  /** gravity multiplier for the kit's own states; 1 for shared behaviour */
  gravityScale(): number;
  /** a fresh run */
  reset(): void;
}
