import { game } from "../../game/state";
import { hitStop } from "../../game/world";
import { sfx } from "../../services/audio";
import { smooth } from "../../utils/math";
import { MOTION, TARGET_RADIUS, TRAINING_ATTACK_DAMAGE } from "../constants";
import { executeFollowUp } from "./followUp";
import type { Fighter, Session, Strike, Swing } from "./model";
import { hitWithSword, spendSwordBonuses } from "./swordInfusion";

export const STRIKES = {
  first: { hit: 0.075, duration: 0.29, reach: 32, height: 14, step: 3, next: "second" },
  second: { hit: 0.075, duration: 0.25, reach: 34, height: 14, step: 0, next: "third" },
  third: { hit: 0.117, duration: 0.37, reach: 35, height: 14, step: 11, next: null },
  air: { hit: 0.058, duration: 0.25, reach: 32, height: 22, step: 0, next: null },
} satisfies Record<
  Strike,
  { hit: number; duration: number; reach: number; height: number; step: number; next: Strike | null }
>;

const HIT_STOP = 0.042;
const CANCEL_AFTER_HIT = 0.033;
const DASH_ATTACK_DELAY = 0.04;

export function canInterrupt(swing: Swing | null): boolean {
  return !swing || swing.age >= STRIKES[swing.kind].hit + CANCEL_AFTER_HIT;
}

export function strikeTravel({ kind, age }: Swing, dt: number): number {
  const { hit, step } = STRIKES[kind];
  const distance = (t: number): number => smooth(hit * 0.48, hit + 0.055, t) * step;
  return (distance(age + dt) - distance(age)) / dt;
}

function impact(session: Session, kind: Strike): void {
  const h = session.fighter;
  const strike = STRIKES[kind];
  const damage = kind === "third" ? TRAINING_ATTACK_DAMAGE * 1.6 : TRAINING_ATTACK_DAMAGE;
  let landed = false;
  for (const enemy of game.enemies) {
    const dx = (enemy.x - h.x) * h.face;
    const dy = enemy.y - h.y;
    if (dx >= -TARGET_RADIUS && dx <= strike.reach + TARGET_RADIUS && Math.abs(dy) <= strike.height) {
      if (hitWithSword(session, enemy, h.face, damage, kind === "third")) {
        landed = true;
      }
    }
  }
  session.releasedStrike = { x: h.x, y: h.y, face: h.face, kind, element: h.swordInfusion?.kind ?? null, landed };
  if (landed) {
    hitStop(HIT_STOP);
    spendSwordBonuses(h);
  }
}

function beginSwing(h: Fighter, groundStrike: Exclude<Strike, "air">): void {
  if (!h.grounded && h.airSlashUsed) {
    h.swing = null;
    return;
  }
  h.dashTime = 0;
  h.airDashActive = false;
  h.parryAge = null;
  h.warp = null;
  if (!h.grounded) {
    h.airSlashUsed = true;
  }
  sfx.swing();
  h.swing = { kind: h.grounded ? groundStrike : "air", age: 0, chain: false, followUp: null };
}

export function fight(session: Session, dt: number): void {
  const h = session.fighter;
  if (!h.grounded && h.airSlashUsed) {
    h.attackBuffer = 0;
  }
  if (h.swing) {
    const swing = h.swing;
    const strike = STRIKES[swing.kind];
    const before = swing.age;
    swing.age += dt;
    if (before < strike.hit && swing.age >= strike.hit) {
      impact(session, swing.kind);
    }
    if (swing.followUp && canInterrupt(swing)) {
      executeFollowUp(session, swing.followUp);
      return;
    }
    if (h.attackBuffer > 0 && strike.next && !swing.chain && swing.age >= strike.hit * 0.65) {
      swing.chain = true;
      h.attackBuffer = 0;
    }
    if (strike.next && swing.chain && swing.age >= strike.duration * 0.71) {
      beginSwing(h, strike.next);
    } else if (swing.age >= strike.duration) {
      h.swing = null;
    }
    return;
  }
  if (h.attackBuffer > 0 && h.dashTime <= MOTION.dashTime - DASH_ATTACK_DELAY) {
    h.attackBuffer = 0;
    beginSwing(h, "first");
  }
}
