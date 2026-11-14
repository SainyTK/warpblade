import type { Enemy } from "../enemy";

/** what Ysra's stance part remembers between frames */
export interface StanceMemory {
  /** the backstep's hop has landed and she is in its skid */
  landed: boolean;
  /** where she faced at the last tick, where she faced before her last turn, and seconds since that turn:
   *  a side held away that turned her just before the guard still counts as away */
  face: number;
  faceBefore: number;
  turned: number;
  /** seconds left in which J is a Counter Thrust */
  counter: number;
  /** seconds she has walked one way without stopping, toward Warpath's charge */
  walked: number;
  /** foes the Warpath charge shouldered lately, and how long before it may again */
  shouldered: Map<Enemy, number>;
  /** Juggernaut: the small foes the charge carries on the glaive */
  carried: Enemy[];
}
