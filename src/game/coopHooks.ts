import type { EnemyRank, EnemyType } from "../types/enemy";
import type { RunOutcome } from "../types/run";

/**
 * Where a co-op room's host steps into the shared game code. Solo play never sets these, so every call site keeps its
 * solo behaviour; in a room they pick which player's hero the code around them acts on.
 */
export interface CoopHooks {
  /** act on the standing hero nearest this point, for a foe, a coin or an orb */
  nearest(x: number, y: number): void;
  /** act on any hero still standing, for what the whole room shares, such as waves */
  anyStanding(): void;
  /** act on the hero that made this effect, and give anything it spawns the same owner */
  owner(effect: object): void;
  /** call once for every hero, each one swapped in, and come back to this browser's hero */
  eachHero(draw: () => void): void;
  /** call once for every standing hero, each one swapped in, and come back to the hero in play */
  eachStanding(run: () => void): void;
  /** the place in the room of the hero in play */
  slot(): number;
  /** seconds the hero in play's presses take to come back round to the host as a round trip: 0 for the host, -1 for a
   *  guest not measured yet */
  inputLag(): number;
  /** experience picked up by anyone goes to everyone */
  shareXp(amount: number): void;
  /** a wave was cleared */
  waveCleared(): void;
  /** a hero fell for good or the stage was cleared; the room decides when the run is over */
  endRun(outcome: RunOutcome): void;
  /** foes of a wave for this many players */
  scaleFoes(foes: readonly EnemyType[]): EnemyType[];
  /** draw what only a room shows under the heroes, such as the ring in each player's colour */
  drawUnderlay(): void;
  /** draw what only a room shows over the scene, such as the players' tags */
  drawOverlay(): void;
  /** a foe's HP for this many players */
  scaleFoeHp(rank: EnemyRank, hp: number): number;
}

let hooks: CoopHooks | null = null;

export const coop = (): CoopHooks | null => hooks;

export function setCoopHooks(next: CoopHooks | null): void {
  hooks = next;
}

/** run once in solo play, once per hero in a co-op room */
export function eachHero(run: () => void): void {
  if (hooks) hooks.eachHero(run);
  else run();
}

/** a foe's blow or hazard: tested once in solo play, and against every standing hero in a co-op room */
export function eachStanding(run: () => void): void {
  if (hooks) hooks.eachStanding(run);
  else run();
}

/** which hero is in play, for a hazard that strikes each hero once: always 0 in solo play */
export const heroSlot = (): number => hooks?.slot() ?? 0;

/** the round trip of the hero in play's link, in seconds: 0 in solo play and for the host, -1 for a guest not measured */
export const heroInputLag = (): number => hooks?.inputLag() ?? 0;
