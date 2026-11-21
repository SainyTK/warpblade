import { CHAIN } from "../constants";
import type { Fighter, FollowUp, Session, TrainingInput } from "./model";
import { startWarpStrike } from "./warpStrike";

export function queueFollowUp(h: Fighter, input: TrainingInput): void {
  const swing = h.swing;
  if (!swing || swing.followUp) {
    return;
  }
  const groundSlash = h.grounded && swing.kind !== "air";
  if (groundSlash && input.guard) {
    swing.followUp = "enhancedParry";
  } else if (input.dash && h.warpReadyIn === 0) {
    swing.followUp = "warp";
  }
}

export function executeFollowUp(session: Session, kind: FollowUp): void {
  const h = session.fighter;
  h.swing = null;
  h.attackBuffer = 0;
  h.dashBuffer = 0;
  if (kind === "warp") {
    startWarpStrike(session);
    return;
  }
  if (!h.grounded) {
    return;
  }
  h.vx = 0;
  h.enhancedGuard = CHAIN.enhancedWindow;
  h.guardAge = 0;
}
