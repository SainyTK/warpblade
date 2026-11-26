import { deny } from "../../game/hero/deny";
import type { DrillInput, Fighter, FollowUp, Session } from "../../types/drill";
import { startWarpStrike, warpLocksActions } from "./warpStrike";

export function queueFollowUp(h: Fighter, input: DrillInput): void {
  const swing = h.swing;
  if (!swing || swing.followUp) {
    return;
  }
  const groundSlash = h.grounded && swing.kind !== "air";
  if (groundSlash && input.guard) {
    swing.followUp = "enhancedParry";
  }
}

export function readWarp(session: Session, input: DrillInput): void {
  const h = session.fighter;
  if (!input.warp || h.stun > 0 || warpLocksActions(h)) {
    return;
  }
  if (h.warpReadyIn > 0) {
    deny("warp");
    return;
  }
  if (h.swing) {
    h.swing.followUp = "warp";
    return;
  }
  h.spellRelease = null;
  startWarpStrike(session);
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
  h.enhancedGuard = session.profile.enhancedParry;
  h.guardAge = 0;
}
