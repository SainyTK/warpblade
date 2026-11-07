import { MOMENTUM as M } from "../../../constants/orrin/momentum";
import { MOMENTUM_REACH } from "../../../constants/orrin/string";
import { skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { orrin } from "./memory";

const PERPETUAL = "o_perpetual";

/** add Momentum, up to the top of the bar */
export function gainMomentum(amount: number): void {
  orrin.momentum = Math.min(M.most, orrin.momentum + amount);
}

/** a blow that hurt him knocks Momentum out of him; Perpetual Motion softens it */
export function loseMomentumToHurt(): void {
  const cost = skillLevel(PERPETUAL) ? skillValues(PERPETUAL).hurt : M.hurt;
  orrin.momentum = Math.max(skillValues(PERPETUAL).start ?? 0, orrin.momentum - cost);
}

/**
 * Each step: speed in the air fills the bar, standing on the floor without a tip hit drains it after a grace, and
 * Perpetual Motion slows the drain and fills it while he walks.
 */
export function tickMomentum(dt: number): void {
  const v = skillValues(PERPETUAL);
  // Perpetual Motion from level 4: the bar never falls below its floor
  if (v.start) orrin.momentum = Math.max(orrin.momentum, v.start);
  const speed = Math.hypot(hero.vx, hero.vy);
  if (!hero.ground) {
    orrin.grounded = 0;
    if (speed > M.fastFrom) gainMomentum(M.flying * dt);
    return;
  }
  orrin.grounded += dt;
  if (v.walk && Math.abs(hero.vx) > 15) gainMomentum(v.walk * dt);
  if (orrin.grounded < M.grace || (v.endless && orrin.kites > 0)) return;
  orrin.momentum = Math.max(v.start ?? 0, orrin.momentum - M.drain * (v.drain ?? 1) * dt);
}

/** a tip hit fills the bar and holds the drain off */
export function tipMomentum(): void {
  gainMomentum(M.tip);
  orrin.grounded = 0;
}

/** the share of the bar filled, 0 to 1 */
export const momentumShare = (): number => orrin.momentum / M.most;

/** every hit he deals is multiplied by this: up to +40% at a full bar, more with Perpetual Motion */
export const momentumScale = (): number => 1 + (skillValues(PERPETUAL).bonus ?? M.bonus) * momentumShare();

/** pixels every blow reaches further: some from half a bar */
export const momentumReach = (): number => (orrin.momentum >= M.reachFrom ? MOMENTUM_REACH : 0);

/** the bar is full: the chain glows and the tip trails brass */
export const fullMomentum = (): boolean => orrin.momentum >= M.most - 0.01;
