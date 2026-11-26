import { cue } from "../../game/cue";
import { emitSkillEvent } from "../../game/skills/events";
import { game } from "../../game/state";
import { hitStop } from "../../game/world";
import { sfx } from "../../services/audio";
import type { DrillProfile, DrillStrikeId, Session, Swing } from "../../types/drill";
import { smooth } from "../../utils/math";
import { KEEN_WINDOW, TARGET_RADIUS } from "../constants";
import { executeFollowUp } from "./followUp";
import { swingTouches } from "./swingArea";
import { hitWithSword, spendSwordBonuses } from "./swordInfusion";

const HIT_STOP = 0.042;
const CANCEL_AFTER_HIT = 0.033;
const DASH_ATTACK_DELAY = 0.04;

export function canInterrupt(profile: DrillProfile, swing: Swing | null): boolean {
  return !swing || swing.age >= profile.strikes[swing.kind].hit + CANCEL_AFTER_HIT;
}

export function strikeTravel(profile: DrillProfile, { kind, age }: Swing, dt: number): number {
  const { hit, step } = profile.strikes[kind];
  const distance = (t: number): number => smooth(hit * 0.48, hit + 0.055, t) * step;
  return (distance(age + dt) - distance(age)) / dt;
}

function impact(session: Session, swing: Swing): void {
  const { kind, keen } = swing;
  const { fighter: h, profile, modifiers } = session;
  const strike = profile.strikes[kind];
  const reach = strike.reach * modifiers.strikeReach;
  const damage =
    profile.attack * strike.damage * modifiers.strikeDamage * (strike.finisher ? modifiers.finisherDamage : 1);
  let landed = false;
  const near = h.x - h.face * TARGET_RADIUS;
  const far = h.x + h.face * (reach + TARGET_RADIUS);
  for (const enemy of game.enemies) {
    if (swingTouches(enemy, near, far, h.y, strike.height)) {
      if (hitWithSword(session, enemy, h.face, damage, strike.finisher, keen)) {
        landed = true;
      }
    }
  }
  const element = h.swordInfusion?.spell ?? null;
  session.releasedStrike = { x: h.x, y: h.y, face: h.face, kind, element, landed };
  profile.hooks?.slashed?.(kind, landed);
  emitSkillEvent({ type: "slash", strike: kind, landed, element: element?.id ?? null });
  swing.landed = landed;
  if (landed) {
    hitStop(HIT_STOP);
    spendSwordBonuses(h);
  }
}

function beginSwing(session: Session, groundStrike: DrillStrikeId, keen = false): void {
  const h = session.fighter;
  if (!h.grounded && h.airSlashes > session.modifiers.airSlashes) {
    h.swing = null;
    return;
  }
  h.dashTime = 0;
  h.airDashActive = false;
  h.parryAge = null;
  h.warp = null;
  if (!h.grounded) {
    h.airSlashes++;
  }
  const kind = h.grounded ? groundStrike : "air";
  if (session.profile.strikes[kind].finisher) {
    sfx.swingHeavy();
  } else {
    sfx.swing();
  }
  h.swing = {
    kind,
    age: 0,
    chain: false,
    landed: false,
    keen: keen && h.grounded,
    keenNext: false,
    followUp: null,
  };
  if (h.swing.keen) {
    sfx.chime(2);
    cue(h.x, h.y - 36, "keen");
  }
}

export function fight(session: Session, dt: number): void {
  const { fighter: h, profile } = session;
  if (!h.grounded && h.airSlashes > session.modifiers.airSlashes) {
    h.attackBuffer = 0;
  }
  if (h.swing) {
    const swing = h.swing;
    const strike = profile.strikes[swing.kind];
    const before = swing.age;
    swing.age += dt;
    if (before < strike.hit && swing.age >= strike.hit) {
      impact(session, swing);
    }
    if (swing.followUp && canInterrupt(profile, swing)) {
      executeFollowUp(session, swing.followUp);
      return;
    }
    if (h.attackBuffer > 0 && strike.next && !swing.chain && swing.age >= strike.hit * 0.65) {
      const pressedAt = swing.age - (session.motion.buffer - h.attackBuffer);
      swing.chain = true;
      swing.keenNext = swing.landed && pressedAt >= strike.hit && pressedAt <= strike.hit + KEEN_WINDOW;
      h.attackBuffer = 0;
    }
    if (strike.next && swing.chain && swing.age >= strike.duration * 0.71) {
      beginSwing(session, strike.next, swing.keenNext);
    } else if (swing.age >= strike.duration) {
      h.swing = null;
    }
    return;
  }
  if (h.attackBuffer > 0 && h.dashTime <= session.motion.dashTime - DASH_ATTACK_DELAY) {
    h.attackBuffer = 0;
    beginSwing(session, "first");
  }
}
