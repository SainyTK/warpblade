import type { Enemy } from "./enemy";
import type { Hero } from "./hero";
import type { MoveHit, Situation } from "./move";
import type { AbilitySlot, GuardStyle, WarpStyle } from "./moveset";
import type { Pose } from "./pose";

/** a blow of the hero's own, as a kit's damage bonus reads it */
export interface OwnHit {
  back: boolean;
  keen: boolean;
  melee: boolean;
}

/**
 * How one hero plays, as part of its `HeroModule` (src/types/heroModule.ts). The shared loop (updateHero, the combo engine, physics, hurt) calls into the kit of the hero
 * being played, so each hero owns its own presses, combo choices, states and poses.
 *
 * Every Armory item helps every hero, so a kit also keeps these promises (see docs/meta-progress.md): it calls
 * `travelEnded()` (src/game/hero/travelEnd.ts) when each of its travel moves ends, deals its damage from
 * `progress.stats.ad` and `progress.stats.ap`, spends stamina on its defence or travel and MP on the shared ultimate,
 * walks at `progress.stats.move` and lets blows reach `hurtHero`.
 */
export interface HeroKit {
  /** timers of the kit's own state, every frame before presses are read */
  tick(dt: number): void;
  /** use waiting presses: walk direction and a double tap toward a side (0 when none) */
  readActions(dir: number, tap: number): void;
  /** the combo move J starts now, from what is around the hero; null when the combo cannot go on */
  chooseMove(s: Situation): string | null;
  /** run the kit's own states; false hands the state to the shared runner */
  runState(dt: number): boolean;
  /** the pose for the kit's own states and its own free-state look; null uses the shared clips */
  pose(h: Hero, t: number): Pose | null;
  /** after a combo move's blow, with how many foes it hit */
  afterStrike(id: string, hits: number): void;
  /** a combo move's blow as the kit's skills shape it (power, reach, guard break); left out, the move's own */
  shapeHit?(id: string, hit: MoveHit): MoveHit;
  /** seconds after a blow lands that a J press is Keen; left out, `KEEN.window` */
  keenWindow?(): number;
  /** every move starts Keen right now, whatever the timing */
  alwaysKeen?(): boolean;

  /** J held: how the hero's warp move looks and what it adds (the shared move is src/game/hero/warp.ts) */
  warp: WarpStyle;
  /** K: how the hero's guard and parry play (the shared guard is src/game/hero/heroGuard.ts) */
  guard: GuardStyle;
  /** I: the hero's abilities in the order O turns through them (the shared bar is src/game/hero/abilityBar.ts) */
  abilities: readonly AbilitySlot[];
  /**
   * The shared actions (warp, guard, dodge, ability, ultimate) may start now, cutting what the hero is doing; left out,
   * when the hero is free, the current blow has landed or the shared cast has let its spell go (`castLanded`). A kit
   * that enters the shared cast and sets its own rule lets the cast be cut once its spell has gone too
   */
  mayAct?(): boolean;
  /** a shared action is starting: the kit ends its own state (a string, a held foe, a hover) */
  cutForAction?(): void;
  /** while true, presses of the shared actions wait past the input buffer, because the kit's own state will let them
   *  cut it soon; left out, only through the shared cast */
  holdsSharedPresses?(): boolean;
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
  /** extra damage one of the hero's own hits deals, added together (0.5 is +50%); left out, none */
  hitBonus?(e: Enemy, hit: OwnHit): number;
  /** extra damage a foe takes from every source, added together and to a mark, at most `DAMAGE.takenCap`; left out, none */
  takenBonus?(e: Enemy): number;
  /** the front dodge may start in the air right now; left out, only on the floor */
  airDodge?(): boolean;
  /** the front dodge started, passed through a foe, or ended: a kit's own cut or trail along it */
  dodge?: { started?(): void; passed?(e: Enemy): void; ended?(): void };
  /**
   * A blow has taken its HP and the hero still stands: true when the kit's armour takes the blow instead of the hurt
   * state, so the knockback, the flinch and the combo reset are skipped. Left out, every blow hurts as usual.
   */
  steadfast?(): boolean;
  /** the kit drives the hero's horizontal speed itself this frame (a backstep, a dive, a charge) */
  drivesMotion(): boolean;
  /** gravity multiplier for the kit's own states; 1 for shared behaviour */
  gravityScale(): number;
  /** drawn on the floor in front of the scene and behind the foes, so it never covers a wind-up (a sigil, a ring) */
  drawFloor?(): void;
  /** drawn in the world behind the hero, for parts of the kit that reach past the sprite (a spirit sword at rest) */
  drawBack?(): void;
  /** drawn in the world over the hero, for parts of the kit that reach past the sprite (a cast ring, a counter mark) */
  draw?(): void;
  /** drawn over the whole scene after the damage numbers, for markers that must stay readable */
  drawOver?(): void;
  /** how visible the hero's sprite is right now, 0 to 1 (gone for the blink of a step); left out, 1 */
  heroAlpha?(): number;
  /** a foe fell to a hit of this hero's (any source of theirs), with the hero swapped in: a kit's own drops or counts */
  onKill?(e: Enemy): void;
  /**
   * One of the hero's own hits landed on a foe (not damage over time, not a skill's own hit): `crit` it was a critical
   * hit, `kill` it felled the foe. Left out, nothing happens.
   */
  landed?(e: Enemy, hit: { crit: boolean; kill: boolean }): void;
  /** a fresh run */
  reset(): void;
}
