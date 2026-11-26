import { hitStop } from "../../game/world";
import type { DefenseCue, DrillInput, Fighter, Session, Side } from "../../types/drill";
import { DEFENSE } from "../constants";

export function readGuard(h: Fighter, input: DrillInput, canCancel: boolean, dt: number): void {
  h.stun = Math.max(0, h.stun - dt);
  h.enhancedGuard = Math.max(0, h.enhancedGuard - dt);
  if (h.parryAge !== null) {
    h.parryAge += dt;
    if (h.parryAge >= DEFENSE.parryPoseTime) {
      h.parryAge = null;
    } else if (h.attackBuffer > 0) {
      h.guardAge = null;
      return;
    }
  }
  if ((!input.guardHeld && !input.guard && h.enhancedGuard === 0) || !canCancel || h.dashTime > 0 || h.stun > 0) {
    h.guardAge = null;
    return;
  }
  h.guardAge = h.guardAge === null || input.guard ? 0 : h.guardAge + dt;
  h.swing = null;
  h.warp = null;
  h.jumpBoost = false;
  if (input.dir) {
    h.face = input.dir;
  }
}

export function defend(session: Session, incoming: Side): DefenseCue {
  const h = session.fighter;
  const guardAge = h.face === -incoming ? h.guardAge : null;
  const kind =
    guardAge === null
      ? "hit"
      : h.enhancedGuard > 0
        ? "enhancedParry"
        : guardAge <= DEFENSE.parryWindow * session.modifiers.parryWindow
          ? "parry"
          : "block";
  const cue: DefenseCue = { kind, x: h.x - incoming * 9, y: h.y - 17, life: DEFENSE.cueLife };
  session.defenseCue = cue;
  if (kind === "hit") {
    h.stun = DEFENSE.stun;
    h.swing = null;
    h.guardAge = null;
    h.parryAge = null;
    h.dashTime = 0;
    h.airDashActive = false;
    h.spellRelease = null;
    h.warp = null;
    h.chargeHeldFor = null;
    h.jumpBoost = false;
    h.vx = incoming * 96;
  } else if (kind === "parry" || kind === "enhancedParry") {
    h.parryAge = 0;
  }
  h.enhancedGuard = 0;
  const pause = { enhancedParry: 0.064, parry: 0.045, block: 0.043, hit: 0.055 }[kind];
  hitStop(pause);
  return cue;
}

export function ageDefenseCue(session: Session, dt: number): void {
  const cue = session.defenseCue;
  if (cue) {
    cue.life -= dt;
    if (cue.life <= 0) {
      session.defenseCue = null;
    }
  }
}
