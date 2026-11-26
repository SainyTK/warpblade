import { emitSkillEvent } from "../../game/skills/events";
import { game } from "../../game/state";
import { sfx } from "../../services/audio";
import type { DrillInput, DrillProfile, DrillTier, Fighter, Session, SkillCast } from "../../types/drill";
import { strikeEnemy } from "./enemyContact";

export function chargedTier(profile: DrillProfile, heldFor: number): DrillTier | undefined {
  let tier: DrillTier | undefined;
  for (const option of profile.tiers) {
    if (heldFor >= option.threshold) {
      tier = option;
    }
  }
  return tier;
}

export function trackChargePress(h: Fighter, input: DrillInput): void {
  if (input.attack && input.attackHeld && !h.skillCast && h.stun === 0) {
    h.chargeHeldFor = 0;
  }
}

function releaseSkill(session: Session, cast: SkillCast): void {
  const { tier, x, y, face } = cast;
  const { tierDamage, tierReach } = session.modifiers;
  sfx.ultimate(tier.level);
  emitSkillEvent({ type: "ultimate", level: tier.level });
  for (const enemy of game.enemies) {
    const delta = enemy.x - x;
    const reach = tier.around ? Math.abs(delta) : delta * face;
    if (reach < -5 || reach > tier.reach * tierReach || Math.abs(enemy.y - y) > tier.height) {
      continue;
    }
    strikeEnemy(session.profile, enemy, tier.damage * tierDamage, x, "ultimate", true);
  }
  session.profile.hooks?.released?.(cast);
}

export function tickSkill(session: Session, input: DrillInput, dt: number): void {
  const h = session.fighter;
  const cast = h.skillCast;
  if (cast) {
    const before = cast.age;
    cast.age += dt;
    if (before < cast.tier.intro) {
      cast.x = h.x;
      cast.y = h.y;
      if (cast.age >= cast.tier.intro) {
        releaseSkill(session, cast);
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
    const before = chargedTier(session.profile, h.chargeHeldFor);
    h.chargeHeldFor += dt * session.modifiers.chargeRate;
    const reached = chargedTier(session.profile, h.chargeHeldFor);
    if (reached && reached !== before) {
      sfx.chargeStep(reached.level);
    }
    return;
  }
  const tier = chargedTier(session.profile, h.chargeHeldFor);
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
