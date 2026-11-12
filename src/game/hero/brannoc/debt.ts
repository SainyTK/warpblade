import { DEBT } from "../../../constants/brannoc/fury";
import { BERSERK, FRENZY } from "../../../constants/brannoc/moves";
import type { DebtChange } from "../../../types/brannoc";
import type { Enemy } from "../../../types/enemy";
import { createDebtMotes } from "../../effects/brannoc/debtMotes";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { deny } from "../deny";
import { brannoc } from "./memory";

/** where the motes land: his chest */
const CHEST = 18;

/** the most the debt holds, in HP: 40% of max HP, more with Scarred Hide */
export const debtCap = (): number => progress.stats.hp * (DEBT.cap + (skillValues("b_scarred").cap ?? 0));

function emit(change: DebtChange, amount: number): void {
  emitSkillEvent({ type: "debt", change, amount });
}

/** HP he can spend without falling under 1 */
export const canSpend = (share: number): boolean => hero.hp - progress.stats.hp * share >= 1;

/**
 * Pay for a K or I press with HP: refused with the deny tick and a blink of the HP bar when it would leave him under 1
 * HP; otherwise the cost comes off his HP into the debt, up to its cap, and anything past the cap is gone for good.
 */
export function spendHp(share: number): boolean {
  if (!canSpend(share)) {
    deny("hp");
    return false;
  }
  const cost = progress.stats.hp * share;
  hero.hp -= cost;
  brannoc.lastHp = hero.hp;
  const kept = Math.min(cost, Math.max(0, debtCap() - brannoc.debt));
  brannoc.debt += kept;
  brannoc.debtIdle = 0;
  emit("spend", cost);
  return true;
}

/** a multiple on what one repay returns: Frenzy, Berserk (Unending Rage's own) */
function repayScale(): number {
  let k = 1;
  if (brannoc.frenzyT > 0) k *= FRENZY.repay;
  if (brannoc.berserkT > 0) k *= brannoc.unending ? (skillValues("b_unending").repay ?? BERSERK.repay) : BERSERK.repay;
  return k;
}

/**
 * Win back `share` of max HP from the debt into his HP, from a struck foe when there is one: the motes fly from it to
 * his chest and the segment brightens. Returns the HP won back.
 */
export function repay(share: number, from: Enemy | null): number {
  if (brannoc.debt <= 0 || hero.hp <= 0) return 0;
  const room = Math.max(0, progress.stats.hp - hero.hp);
  const amount = Math.min(brannoc.debt, room, progress.stats.hp * share * repayScale());
  if (amount <= 0) return 0;
  brannoc.debt -= amount;
  hero.hp += amount;
  brannoc.lastHp = hero.hp;
  brannoc.debtIdle = 0;
  brannoc.repayFlash = DEBT.repayFlash;
  if (from) {
    const [x, y] = enemyCenter(from);
    game.fx.push(createDebtMotes(x, y, hero.x, hero.y - CHEST));
  }
  emit("repay", amount);
  return amount;
}

/**
 * One of his own blows landed (any source of his but summons and damage over time): each foe, at most three a blow,
 * returns 2.5% of max HP from the debt, a crit 5% (double in Blood Pact), a kill 5% more.
 */
export function repayOnHit(e: Enemy, crit: boolean, kill: boolean, multiple = 1): void {
  if (brannoc.repaidSwing !== hero.swing) {
    brannoc.repaidSwing = hero.swing;
    brannoc.repaid = 0;
  }
  if (brannoc.repaid >= DEBT.foes) return;
  brannoc.repaid++;
  const pactCrit = crit && brannoc.pactT > 0 ? 2 : 1;
  const share = (crit ? DEBT.crit * pactCrit : DEBT.repay) + (kill ? DEBT.kill : 0);
  repay(share * multiple, e);
}

/** a blow took his HP: the whole debt is gone (half with Thousand Scars), with a white flash and shards */
function forfeit(): void {
  if (brannoc.debt <= 0) return;
  const lost = skillValues("b_scarred").thousand ? brannoc.debt / 2 : brannoc.debt;
  const max = Math.max(1, progress.stats.hp);
  brannoc.forfeitFrom = hero.hp / max;
  brannoc.forfeitWidth = lost / max;
  brannoc.debt -= lost;
  brannoc.forfeitT = DEBT.forfeitFlash + DEBT.forfeitShards;
  emit("forfeit", lost);
}

/** the debt fades after a while with no blow landed, slower with Scarred Hide; never in Berserk or Blood Pact's hold */
function fade(dt: number): void {
  brannoc.debtIdle += dt;
  if (brannoc.debt <= 0 || brannoc.debtIdle < DEBT.idle) return;
  if (brannoc.berserkT > 0) return;
  if (brannoc.pactT > 0 && skillValues("b_pact").noFade) return;
  const slower = 1 - (skillValues("b_scarred").fade ?? 0);
  const amount = Math.min(brannoc.debt, progress.stats.hp * DEBT.fade * slower * dt);
  brannoc.debt -= amount;
  emit("fade", amount);
}

/** every frame: a blow that took HP forfeits the debt, the debt fades, and it never reaches past the empty part of the bar */
export function tickDebt(dt: number): void {
  brannoc.repayFlash = Math.max(0, brannoc.repayFlash - dt);
  brannoc.forfeitT = Math.max(0, brannoc.forfeitT - dt);
  const lost = brannoc.lastHp >= 0 && hero.hp < brannoc.lastHp && hero.state !== "dead";
  brannoc.lastHp = hero.hp;
  if (lost) forfeit();
  fade(dt);
  brannoc.debt = Math.max(0, Math.min(brannoc.debt, progress.stats.hp - hero.hp));
}

/** HP spent and refused presses: a press that cannot be paid for gets the HP bar's blink */
export const debtShare = (): number => brannoc.debt / Math.max(1, progress.stats.hp);
