import { KEEN } from "../../../constants/combo";
import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { createImpact } from "../../../game/effects/impact";
import { resetMotion } from "../../../game/hero/motion";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { HeroKit } from "../../../types/kit";
import { SANCTUARY } from "../constants/abilities";
import { RADIANCE } from "../constants/kit";
import { DAWN_RAMP, DAWN_SPARKS } from "../constants/light";
import { SHATTER_RING } from "../constants/skillNumbers";
import type { AldricMoveId } from "../types/moves";
import { ALDRIC_SLOTS, rechargeAbilities, runAbilityState } from "./abilities";
import { afterStrike } from "./afterStrike";
import { chooseMove } from "./chooseMove";
import { createDelayedRing } from "./effects/delayedRing";
import { guardWalkSpeed, runAldricGuard } from "./guardBash";
import { ALDRIC_GUARD } from "./guardStyle";
import { drawAldric } from "./look";
import { aldricPose } from "./pose";
import { readActions } from "./readActions";
import { shapeHit } from "./shapeHit";
import { brandBonus } from "./skillBonus";
import { aldric, resetAldricState, tickAldricState } from "./state";
import { SHIELD_STEP } from "./step";
import { inDome } from "./ultimate/sanctuary";
import { radiant, tickValor } from "./valor";
import { ALDRIC_WARP } from "./warpStyle";

/** Bulwark takes a blow: nothing gets through, and the shell flashes and breaks when it has taken its last */
function bulwarkTakes(fromX: number): boolean {
  if (aldric.barrier <= 0 || aldric.barrierBlows <= 0) return false;
  aldric.barrierBlows--;
  if (aldric.barrierBlows <= 0) {
    aldric.barrier = 0;
    shatter();
  }
  hero.inv = Math.max(hero.inv, 0.3);
  const dir = Math.sign(fromX - hero.x) || hero.face;
  game.fx.push(createImpact(hero.x + dir * 9, hero.y - 20, dir, true, DAWN_SPARKS));
  lights.add(hero.x, hero.y - 20, 28, DAWN_RAMP[5], 0.6, 0.2);
  sfx.block();
  return true;
}

/** Bulwark Arrival: Bulwark bursts with light as it breaks */
function shatter(): void {
  const v = skillValues("al_bulwark").shatter;
  if (!v) return;
  game.fx.push(
    createDelayedRing(hero.x, hero.y, withCharms("area", SHATTER_RING), 0, progress.stats.ad * v, {
      kx: 90,
      ky: -50,
      heavy: true,
    }),
  );
}

/** Mending Light's healing over time */
function mend(dt: number): void {
  if (aldric.mending <= 0) return;
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * (skillValues("al_mend").regen ?? 0) * dt);
}

/** Aldric: a three-blow string, a guard he walks and bashes behind, Valor and Radiance, Shield Rush and Sunpillar */
export const ALDRIC_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(rechargeStep(dt));
    tickAldricState(dt);
    tickValor(dt);
    mend(dt);
  },
  readActions,
  warp: ALDRIC_WARP,
  guard: ALDRIC_GUARD,
  abilities: ALDRIC_SLOTS,
  chooseMove,
  runState: (dt) => {
    if (hero.state === "guard") {
      runAldricGuard(dt);
      return true;
    }
    return runAbilityState();
  },
  pose: aldricPose,
  afterStrike: (id, hits) => afterStrike(id as AldricMoveId, hits),
  shapeHit,
  absorbHurt: (_dmg, fromX) => bulwarkTakes(fromX),
  hitBonus: (_e, hit) => (radiant() && hit.melee ? RADIANCE.bonus : 0),
  takenBonus: brandBonus,
  keenWindow: () => KEEN.window + (skillValues("al_verdict").keen ?? 0),
  dodge: SHIELD_STEP,
  landed: () => {
    const heal = skillValues("al_resolve").heal;
    if (heal && radiant()) hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * heal);
  },
  attackRate: () =>
    1 +
    (aldric.rally > 0 ? (skillValues("al_rally").haste ?? 0) : 0) +
    (radiant() ? (skillValues("al_resolve").haste ?? 0) : 0),
  walkSpeed: (speed) => (hero.state === "guard" ? guardWalkSpeed() : speed),
  cutForAction: () => {
    aldric.bashT = -1;
  },
  draw: drawAldric,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => (inDome() ? SANCTUARY.taken : 1),
  drivesMotion: () => hero.state === "guard" || hero.state === "rush",
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetAldricState();
  },
};
