import type { HeroKit } from "../../../types/kit";
import { use } from "../../input";
import { YSRA_SLOTS } from "./abilities";
import { buffs, resetBuffs, tickBuffs } from "./buffs";
import { emitYsra } from "./events";
import { chooseGlaive, GLAIVE_PART, pressGlaive } from "./glaive/glaive";
import { resetHandover } from "./handover";
import { JAVELIN_PART, YSRA_WARP } from "./javelin/javelin";
import { resetLandingDip } from "./landingDip";
import type { YsraPart } from "./part";
import { ysraPose } from "./pose";
import { PYRE_PART } from "./pyre/pyre";
import { chargeNow, pressJump, STANCE_PART, stanceMayAct, YSRA_GUARD } from "./stance/stance";

/** the glaive string (J), the hurled glaive (J held), her vault, dive and guard, Heat and rites */
const PARTS: readonly YsraPart[] = [GLAIVE_PART, JAVELIN_PART, STANCE_PART, PYRE_PART];

/**
 * Ysra: a long glaive string that pierces the line, the glaive hurled like a javelin to warp to, a firm guard whose
 * parry opens a counter thrust, a pole vault and an air dive for travel, and Heat built by her blows and spent on fire
 * rites. The shared reader takes the warp, guard, dodge, abilities and ultimate.
 */
export const YSRA_KIT: HeroKit = {
  warp: YSRA_WARP,
  guard: YSRA_GUARD,
  abilities: YSRA_SLOTS,
  tick: (dt) => {
    tickBuffs(dt);
    for (const p of PARTS) p.tick?.(dt);
  },
  // no blow of hers needs a direction pressed with it
  readActions: (_dir, tap) => {
    if (tap) chargeNow(tap);
    use("up", pressJump);
    use("attack", pressGlaive);
  },
  chooseMove: chooseGlaive,
  runState: (dt) => PARTS.some((p) => p.runState?.(dt) ?? false),
  pose: ysraPose,
  afterStrike: (id, hits) => emitYsra("strike", { source: id, hits }),
  mayAct: stanceMayAct,
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
