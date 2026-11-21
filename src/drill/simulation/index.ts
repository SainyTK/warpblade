import type { DrillInput, DrillProfile, Session } from "../../types/drill";
import { MOTION } from "../constants";
import { tickSkill, trackChargePress } from "./chargedSkill";
import { canInterrupt, fight } from "./combat";
import { ageDefenseCue, readGuard } from "./defense";
import { queueFollowUp } from "./followUp";
import { move } from "./movement";
import { createSpellBook, readSpellBook, tickSpellBook, tickSpellRelease } from "./spellBook";
import { tickSpellStrikes } from "./spellStrike";
import { tickWarpStrike, warpLocksActions } from "./warpStrike";

export { chargedTier } from "./chargedSkill";
export { canInterrupt } from "./combat";
export { defend } from "./defense";

export function createSession(profile: DrillProfile, x: number, y: number): Session {
  const modifiers = profile.modifiers();
  return {
    profile,
    motion: { ...MOTION, ...profile.motion },
    modifiers,
    fighter: {
      x,
      y,
      vx: 0,
      vy: 0,
      face: 1,
      grounded: true,
      wall: 0,
      droppedPlatform: null,
      wallLock: 0,
      grace: 0,
      jumpBoost: false,
      airDashes: 1 + modifiers.airDashes,
      dashTime: 0,
      dashReadyIn: 0,
      airDashActive: false,
      airSlashes: 0,
      warpReadyIn: 0,
      warp: null,
      jumpBuffer: 0,
      dashBuffer: 0,
      attackBuffer: 0,
      swing: null,
      guardAge: null,
      parryAge: null,
      enhancedGuard: 0,
      spellRelease: null,
      chargeHeldFor: null,
      skillCast: null,
      spellBook: createSpellBook(profile),
      swordInfusion: null,
      stun: 0,
    },
    warpTrace: null,
    elementProjectiles: [],
    elementImpacts: [],
    releasedStrike: null,
    defenseCue: null,
  };
}

function buffer(pressed: boolean, remaining: number, dt: number): number {
  return pressed ? MOTION.buffer : Math.max(0, remaining - dt);
}

export function ageDrillCues(session: Session, dt: number): void {
  const h = session.fighter;
  tickSpellBook(h.spellBook, dt);
  if (h.swordInfusion) {
    h.swordInfusion.age += dt;
  }
  ageDefenseCue(session, dt);
}

export function stepSession(session: Session, input: DrillInput, dt: number): void {
  const h = session.fighter;
  session.modifiers = session.profile.modifiers();
  session.releasedStrike = null;
  ageDrillCues(session, dt);
  trackChargePress(h, input);
  tickSkill(session, input, dt);
  const casting = h.skillCast !== null;
  h.dashReadyIn = Math.max(0, h.dashReadyIn - dt);
  h.warpReadyIn = Math.max(0, h.warpReadyIn - dt);
  if (casting) {
    h.jumpBuffer = 0;
    h.dashBuffer = 0;
    h.attackBuffer = 0;
  } else {
    const dashPress = input.dash && !h.swing;
    queueFollowUp(h, input);
    if (!warpLocksActions(h)) {
      readSpellBook(session, input);
    }
    h.jumpBuffer = buffer(input.jump, h.jumpBuffer, dt);
    h.dashBuffer = h.dashReadyIn === 0 && !h.swing?.followUp ? buffer(dashPress, h.dashBuffer, dt) : 0;
    h.attackBuffer = buffer(input.attack, h.attackBuffer, dt);
  }
  tickSpellRelease(h, dt);
  tickSpellStrikes(session, dt);
  tickWarpStrike(session, dt);
  const actionLocked = casting || warpLocksActions(h);
  const canCancel = !actionLocked && canInterrupt(session.profile, h.swing) && !h.swing?.followUp && !h.spellRelease;
  readGuard(h, input, canCancel, dt);
  const free = !actionLocked && h.guardAge === null && h.stun === 0 && !h.spellRelease;
  move(session, input, free && canCancel, dt);
  if (free) {
    fight(session, dt);
  }
}
