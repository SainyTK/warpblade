import type { FighterProbe } from "./types";

export const fighterBusy = (probe: FighterProbe): boolean =>
  probe.swing !== null ||
  probe.dash > 0 ||
  probe.guard ||
  probe.warp !== null ||
  probe.release ||
  !probe.ground ||
  probe.skillCast;

export const fighterAtRest = (probe: FighterProbe, homeX: number, tolerance: number): boolean =>
  probe.ground &&
  Math.abs(probe.x - homeX) < tolerance &&
  probe.swing === null &&
  probe.warp === null &&
  probe.dash === 0 &&
  !probe.guard;
