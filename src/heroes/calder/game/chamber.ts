import { skillValues } from "../../../game/skills/query";
import { CHAMBER_ROUNDS, CLICK_FLASH, HOT_BLAST } from "../constants/chamber";
import { calder } from "./state";

/** rounds a full chamber holds: six, and more with Drum Cylinder */
export const chamberSize = (): number => CHAMBER_ROUNDS + (skillValues("ca_drum").rounds ?? 0);

/** spend `n` rounds when the chamber holds them; an emptied chamber is no longer hot */
export function spendRounds(n: number): boolean {
  if (calder.rounds < n) return false;
  calder.rounds -= n;
  if (calder.rounds === 0) calder.hot = false;
  return true;
}

/** a Trigger on an empty chamber: the meter flashes */
export function dryClick(): void {
  calder.click = CLICK_FLASH;
}

/** load `n` rounds, up to a full chamber */
export function loadRounds(n: number): void {
  calder.rounds = Math.min(chamberSize(), calder.rounds + n);
}

/** a reload: the chamber full, hot after a quick one */
export function fillChamber(hot: boolean): void {
  calder.rounds = chamberSize();
  calder.hot = hot;
}

/** what a round's blast is worth now: half again while the rounds are hot */
export const roundPower = (): number => (calder.hot ? HOT_BLAST : 1);
