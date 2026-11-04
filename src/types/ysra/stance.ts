import type { Enemy } from "../enemy";

/** blows thrown out of Ysra's vault, dive, guard and charge */
export type StanceMoveId = "vaultCrash";
export type StanceClipName = "yVaultCrash";

/** what Ysra's stance part remembers between frames */
export interface StanceMemory {
  /** the vault has left the floor; before this she is still planting the glaive */
  launched: boolean;
  /** the vault or dive has landed and she is in the landing crouch */
  landed: boolean;
  /** vaults thrown since she last stood on the floor */
  airVaults: number;
  /** a dive was already used in this airtime */
  dived: boolean;
  /** where she faced at the last tick, where she faced before her last turn, and seconds since that turn:
   *  a side held away that turned her just before L still counts as away */
  face: number;
  faceBefore: number;
  turned: number;
  /** seconds since the brace went up, for the parry window */
  braced: number;
  /** seconds left in which J is a Counter Thrust */
  counter: number;
  /** seconds left in which more blows from the front cost nothing */
  shield: number;
  /** foes the Warpath charge shouldered lately, and how long before it may again */
  shouldered: Map<Enemy, number>;
}
