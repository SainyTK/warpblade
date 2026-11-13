import type { KaelState } from "../../../types/kael/state";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): KaelState => ({
  keenStreak: 0,
  keenCount: 0,
  freeKeen: 0,
  blinkCd: 0,
  phaseBack: 0,
  passage: false,
  chainCd: 0,
  plates: 0,
  spellwarp: 0,
  arcaneCd: 0,
  stormLeft: 0,
  stormVolleys: 0,
});

/** the one owner of what Kael's skills remember in the kit */
export const kael: KaelState = fresh();
rememberPerSeat(objectMemory(kael));

/** a fresh run */
export function resetKaelState(): void {
  Object.assign(kael, fresh());
}

/** the timers run down */
export function tickKaelState(dt: number): void {
  kael.freeKeen = Math.max(0, kael.freeKeen - dt);
  kael.blinkCd = Math.max(0, kael.blinkCd - dt);
  kael.phaseBack = Math.max(0, kael.phaseBack - dt);
  kael.chainCd = Math.max(0, kael.chainCd - dt);
  kael.spellwarp = Math.max(0, kael.spellwarp - dt);
  kael.arcaneCd = Math.max(0, kael.arcaneCd - dt);
}
