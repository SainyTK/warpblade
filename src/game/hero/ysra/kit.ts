import { sfx } from "../../../services/audio";
import type { HeroKit } from "../../../types/kit";
import { take, use } from "../../input";
import { startCharge } from "../ultimate";
import { buffs, resetBuffs, tickBuffs } from "./buffs";
import { emitYsra } from "./events";
import { chooseGlaive, GLAIVE_PART, pressGlaive } from "./glaive/glaive";
import { resetHandover } from "./handover";
import { resetLandingDip } from "./landingDip";
import type { YsraPart } from "./part";
import { ysraPose } from "./pose";
import { cycleRite, PYRE_PART, pressRite } from "./pyre/pyre";
import { chargeNow, pressGuard, pressJump, pressVault, STANCE_PART } from "./stance/stance";

/** the glaive string (J), the vault and guard (K, L, Up), Heat and rites (I, O) */
const PARTS: readonly YsraPart[] = [GLAIVE_PART, STANCE_PART, PYRE_PART];

/**
 * Ysra: a long glaive with held lunges, a pole vault and an air dive for travel, a brace that blocks and parries
 * in place of a dodge, and Heat built by her blows and spent on fire rites.
 */
export const YSRA_KIT: HeroKit = {
  tick: (dt) => {
    tickBuffs(dt);
    for (const p of PARTS) p.tick?.(dt);
  },
  // no blow of hers needs a direction pressed with it; L's backstep away from the foe is her one held-side press
  readActions: (dir, tap) => {
    use("dash", () => pressGuard(dir));
    if (tap) chargeNow(tap);
    use("up", pressJump);
    use("attack", pressGlaive);
    use("warp", pressVault);
    use("cast", pressRite);
    use("ultimate", startCharge);
    if (take("cycle") && cycleRite()) sfx.pickup();
  },
  chooseMove: chooseGlaive,
  runState: (dt) => PARTS.some((p) => p.runState?.(dt) ?? false),
  pose: ysraPose,
  afterStrike: (id, hits) => emitYsra("strike", { source: id, hits }),
  absorbHurt: (dmg, fromX) => PARTS.some((p) => p.absorbHurt?.(dmg, fromX) ?? false),
  attackRate: () => PARTS.reduce((r, p) => r * (p.attackRate?.() ?? 1), 1),
  hurtScale: () => PARTS.reduce((s, p) => s * (p.hurtScale?.() ?? 1), 1 - buffs.guard),
  drivesMotion: () => PARTS.some((p) => p.drivesMotion?.() ?? false),
  gravityScale: () => {
    for (const p of PARTS) {
      const g = p.gravity?.();
      if (g != null) return g;
    }
    return 1;
  },
  reset: () => {
    for (const p of PARTS) p.reset?.();
    resetBuffs();
    resetHandover();
    resetLandingDip();
  },
};
