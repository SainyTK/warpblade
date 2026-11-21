import { emitSkillEvent } from "../../game/skills/events";
import { game } from "../../game/state";
import { sfx } from "../../services/audio";
import { chargedTier } from "../skillTiers";
import { strikeEnemy } from "./enemyContact";
import type { Fighter, Session, SkillCast, TrainingInput } from "./model";

export function trackChargePress(h: Fighter, input: TrainingInput): void {
  if (input.attack && input.attackHeld && !h.skillCast && h.stun === 0) {
    h.chargeHeldFor = 0;
  }
}

function releaseSkill({ tier, x, y, face }: SkillCast): void {
  sfx.ultimate(tier.level);
  emitSkillEvent({ type: "ultimate", level: tier.level });
  for (const enemy of game.enemies) {
    const delta = enemy.x - x;
    const reach = tier.kind === "nova" ? Math.abs(delta) : delta * face;
    if (reach < -5 || reach > tier.reach || Math.abs(enemy.y - y) > tier.height) {
      continue;
    }
    strikeEnemy(enemy, tier.damage, x, "ultimate", true);
  }
}

export function tickSkill(session: Session, input: TrainingInput, dt: number): void {
  const h = session.fighter;
  const cast = h.skillCast;
  if (cast) {
    const before = cast.age;
    cast.age += dt;
    if (before < cast.tier.intro) {
      cast.x = h.x;
      cast.y = h.y;
      if (cast.age >= cast.tier.intro) {
        releaseSkill(cast);
      }
    }
    if (cast.age >= cast.tier.duration) {
      h.skillCast = null;
    }
    return;
  }
  if (h.chargeHeldFor === null) {
    return;
  }
  if (input.attackHeld) {
    h.chargeHeldFor += dt;
    return;
  }
  const tier = chargedTier(h.chargeHeldFor);
  h.chargeHeldFor = null;
  if (tier) {
    h.skillCast = { tier, age: 0, x: h.x, y: h.y, face: h.face };
    h.vx = 0;
    h.dashTime = 0;
    h.airDashActive = false;
    h.jumpBoost = false;
    h.swing = null;
    h.warp = null;
    h.guardAge = null;
    h.parryAge = null;
    h.enhancedGuard = 0;
    h.spellRelease = null;
  }
}
