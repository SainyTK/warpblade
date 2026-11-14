import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { VesperState } from "../types/state";

const fresh = (): VesperState => ({
  tempo: 0,
  idle: 0,
  fall: 0,
  cd: { crescent: 0, stitch: 0, moon: 0, gale: 0, thread: 0 },
  cdFull: { crescent: 1, stitch: 1, moon: 1, gale: 1, thread: 1 },
  casting: "crescent",
  wide: false,
  opened: 0,
  fade: 0,
  keenStreak: 0,
  slipCd: 0,
  slipCut: 0,
  runTop: 0,
  hp: 0,
});

/** the one owner of what Vesper's kit remembers; the HUD meter reads it, so a guest's copy is kept too */
export const vesper: VesperState = fresh();
rememberPerSeat(objectMemory(vesper));

/** a fresh run */
export function resetVesperState(): void {
  Object.assign(vesper, fresh());
}

/** the timers run down */
export function tickVesperState(dt: number): void {
  vesper.opened = Math.max(0, vesper.opened - dt);
  vesper.fade = Math.max(0, vesper.fade - dt);
  vesper.slipCd = Math.max(0, vesper.slipCd - dt);
}
