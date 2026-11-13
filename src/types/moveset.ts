import type { Enemy } from "./enemy";

/**
 * The moveset every hero shares (docs/moveset-design.md): J tapped for the string, J held for the warp move, K guard and
 * parry, L front dodge, I abilities, O switch ability, U the one ultimate. The shared code runs each of them the same
 * way for every hero, so they stay even in power; a kit gives each its own look and its own extra.
 */

/** numbers a hero's warp skills change, read on every warp; anything left out keeps the shared value in `WARP` */
export interface WarpTune {
  /** MP one warp costs */
  cost?: number;
  /** seconds a spent warp takes to come back */
  recharge?: number;
  /** warps that can be spent in a row before the first comes back */
  charges?: number;
  /** the arrival blow's power, as a multiple of attack damage */
  strike?: number;
  /** power added per pixel travelled, and the most it can add */
  perPx?: number;
  cap?: number;
  /** foes the thrown weapon passes through take this multiple of attack damage */
  path?: number;
}

/** how one hero's warp move looks and what it adds; the throw, the flight, the recharge and the arrival blow are shared */
export interface WarpStyle {
  /**
   * A ranged hero throws away from the nearest foe, lands at a safe distance and strikes that foe from there with
   * `strike`. Everyone else throws at the nearest foe ahead and lands beside it.
   */
  ranged?: boolean;
  /**
   * The stat the warp's damage grows with: `ap` for a hero whose damage is mostly ability power (Wenna, Mirel), so
   * every hero's warp hits about as hard. Left out, attack damage.
   */
  stat?: "ap";
  /** with Up held the throw goes to the nearest floating crystal, and the hero hangs from it (Kael) */
  anchors?: boolean;
  /** draws the thrown weapon at (x, y), pointing along `angle` (radians), `t` seconds into its flight */
  drawThrown(x: number, y: number, angle: number, t: number): void;
  /**
   * The arrival blow at `power` times attack damage on `foe` (the foe the throw was aimed at, null for a point); left
   * out, the shared blow: a slash in front that knocks the foe up and back. A kit that sets it deals the same power.
   * `power` already carries the `stat` share, so a kit deals it through `meleeHit` or as `power * progress.stats.ad`.
   */
  strike?(power: number, foe: Enemy | null, sureCrit: boolean): void;
  /** after the arrival blow: the hero's own extra (a grab, a Wick, a Boom). Keep it small; the blow carries the power */
  arrived?(foe: Enemy | null): void;
  /** the hero's warp skills, read on every warp */
  tune?(): WarpTune;
}

/** how one hero's guard and parry play; holding K, the frontal block and the parry window are shared */
export interface GuardStyle {
  /** share of a blocked blow's damage the hero still takes, 0 to 1 */
  chip: number;
  /** stamina one blocked blow costs; with too little left the guard breaks and the blow lands */
  blockCost: number;
  /** a blow from the front was blocked */
  blocked?(fromX: number, foe: Enemy | null): void;
  /**
   * A blow from the front met the guard in its first moments: the hero's own parry reward (a counter, a buff). The
   * shared parry has already taken the blow, staggered `foe` when it is a minion and sent the `parry` skill event.
   */
  parried(fromX: number, foe: Enemy | null): void;
}

/** one ability on I */
export interface AbilitySlot {
  /** the ability's id: the kit's own (`lance`, `smokeKnot`) or a spell skill's */
  id: string;
  /** its HUD tab label, in capitals */
  label: string;
  /** the hero has it now */
  known(): boolean;
  /** seconds left before it can be cast again */
  wait(): number;
  /** the length of its current recharge, for the HUD's share; at least a little above 0 */
  full(): number;
  /** the hero can pay for it now (MP, Heat, Sand, HP) */
  affordable(): boolean;
  /**
   * Cast it now; `wide` is a long press, which casts the wider form when the ability has one and the plain form
   * otherwise. False when the hero cannot cast right now, which keeps the press waiting a moment.
   */
  cast(wide: boolean): boolean;
  /** the colour its HUD tab lights in when selected, a CSS colour or variable; left out, the hero's accent */
  tint?: string;
  /** its spell skill has evolved, for the HUD's gold edge */
  evolved?(): boolean;
  /** what it costs, shown on its selected tab when the cost is not MP (Brannoc's HP) */
  cost?(): string;
  /** an HP cost as a share of max HP, 0 to 1, drawn as a crimson stretch of the touch I button's rim (Brannoc) */
  costShare?(): number;
}
