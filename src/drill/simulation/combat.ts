import { emitSkillEvent } from "../../game/skills/events";
import { game } from "../../game/state";
import { hitStop } from "../../game/world";
import { sfx } from "../../services/audio";
import type { DrillProfile, DrillStrikeId, Session, Swing } from "../../types/drill";
import { smooth } from "../../utils/math";
import { MOTION, TARGET_RADIUS } from "../constants";
import { executeFollowUp } from "./followUp";
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

function impact(session: Session, kind: DrillStrikeId): void {
  const { fighter: h, profile, modifiers } = session;
  const strike = profile.strikes[kind];
  const reach = strike.reach * modifiers.strikeReach;
  const damage =
    profile.attack * strike.damage * modifiers.strikeDamage * (strike.finisher ? modifiers.finisherDamage : 1);
  let landed = false;
  for (const enemy of game.enemies) {
    const dx = (enemy.x - h.x) * h.face;
    const dy = enemy.y - h.y;
    if (dx >= -TARGET_RADIUS && dx <= reach + TARGET_RADIUS && Math.abs(dy) <= strike.height) {
      if (hitWithSword(session, enemy, h.face, damage, strike.finisher)) {
        landed = true;
      }
    }
  }
  const element = h.swordInfusion?.spell ?? null;
  session.releasedStrike = { x: h.x, y: h.y, face: h.face, kind, element, landed };
  profile.hooks?.slashed?.(kind, landed);
  emitSkillEvent({ type: "slash", strike: kind, landed, element: element?.id ?? null });
  if (landed) {
    hitStop(HIT_STOP);
    spendSwordBonuses(h);
  }
}

function beginSwing(session: Session, groundStrike: DrillStrikeId): void {
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
  sfx.swing();
  h.swing = { kind: h.grounded ? groundStrike : "air", age: 0, chain: false, followUp: null };
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
      impact(session, swing.kind);
    }
    if (swing.followUp && canInterrupt(profile, swing)) {
      executeFollowUp(session, swing.followUp);
      return;
    }
    if (h.attackBuffer > 0 && strike.next && !swing.chain && swing.age >= strike.hit * 0.65) {
      swing.chain = true;
      h.attackBuffer = 0;
    }
    if (strike.next && swing.chain && swing.age >= strike.duration * 0.71) {
      beginSwing(session, strike.next);
    } else if (swing.age >= strike.duration) {
      h.swing = null;
    }
    return;
  }
  if (h.attackBuffer > 0 && h.dashTime <= MOTION.dashTime - DASH_ATTACK_DELAY) {
    h.attackBuffer = 0;
    beginSwing(session, "first");
  }
}
