import { FURY } from "../../../constants/brannoc/fury";
import { BRANNOC_STRIDE } from "../../../constants/brannoc/moves";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { feat } from "../../feat";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, progress } from "../../state";
import { resetMotion } from "../kael/motion";
import { PROVISIONAL_GUARD, PROVISIONAL_WARP } from "../provisionalMoveset";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities, tickAbilities } from "./abilities";
import { deathless, extendOnKill, runLastCleave, runRoar, tickBerserk, untouchable } from "./berserk";
import { runCast } from "./cast";
import { repayOnHit, tickDebt } from "./debt";
import { pressFrenzy, runFrenzy, steadfast, tickFrenzy } from "./frenzy";
import { attackRate, furyDamage, isBloodied, walkSpeed, watchBloodied } from "./fury";
import { pressHunt, runChop, runHeadlong, runHunt, tickHunt } from "./hunt";
import { pressJump } from "./jump";
import { drawBerserkTint, dressBrannoc, tickSteam } from "./look";
import { brannoc, resetBrannoc } from "./memory";
import { brannocPose } from "./pose";
import { landed, pressHatchet, pressString, runHatchet, runString, tickLink } from "./string";

function tick(dt: number): void {
  tickDebt(dt);
  watchBloodied(dt);
  tickFrenzy(dt);
  tickBerserk(dt);
  tickHunt(dt);
  tickAbilities(rechargeStep(dt));
  tickLink(dt);
  tickSteam(dt);
  brannoc.pactT = Math.max(0, brannoc.pactT - dt);
  if (hero.ground) landed();
}

/** J: the axe string on the floor, Hatchet Drop in the air */
const pressAxe = (): boolean => (hero.ground ? pressString() : pressHatchet());

function runState(dt: number): boolean {
  switch (hero.state) {
    case "axe":
      runString(dt);
      return true;
    case "hatchet":
      runHatchet(dt);
      return true;
    case "frenzy":
      runFrenzy();
      return true;
    case "hunt":
      runHunt();
      return true;
    case "headlong":
      runHeadlong();
      return true;
    case "huntChop":
      runChop();
      return true;
    case "abilityCast":
    case "spellCast":
      runCast();
      return true;
    case "roar":
      runRoar();
      return true;
    case "lastCleave":
      runLastCleave();
      return true;
    default:
      return false;
  }
}

/** states in which the kit moves him itself */
const DRIVEN = new Set(["hunt", "headlong", "hatchet"]);

/** a foe fell to one of his hits: Bloodthirst heals while Bloodied, On the Edge counts it, and Unending Rage lasts */
function onKill(_e: Enemy): void {
  extendOnKill();
  if (!isBloodied()) return;
  const thirst = skillValues("b_scarred").thirst || FURY.thirst;
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * thirst);
  brannoc.lastHp = hero.hp;
  brannoc.bloodiedKills++;
  feat({ kind: "bloodiedKills", kills: brannoc.bloodiedKills });
}

/**
 * Brannoc: his HP is his resource. Frenzy (K) and his abilities on I cost HP, which becomes a debt he wins back by
 * landing blows before a foe lands one on him; every point of missing HP is Fury, and below 35% he is Bloodied and his
 * Cleave spins twice. Hunt (L) lunges at the nearest foe ahead, and Berserk (U) keeps him standing for a few seconds.
 */
export const BRANNOC_KIT: HeroKit = {
  warp: PROVISIONAL_WARP,
  guard: PROVISIONAL_GUARD,
  abilities: [],
  tick,
  readActions: (dir) => {
    use("dash", () => pressHunt(dir));
    use("up", pressJump);
    use("attack", pressAxe);
    use("warp", pressFrenzy);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: brannocPose,
  afterStrike: () => {},
  absorbHurt: untouchable,
  attackRate,
  walkSpeed,
  stride: () => BRANNOC_STRIDE,
  hurtScale: () => 1,
  damageScale: furyDamage,
  steadfast,
  drivesMotion: () => DRIVEN.has(hero.state),
  gravityScale: () => (hero.state === "headlong" || hero.state === "hunt" ? 0 : 1),
  drawBack: dressBrannoc,
  drawOver: drawBerserkTint,
  onKill,
  landed: (e, hit) => repayOnHit(e, hit.crit, hit.kill),
  hpFloor: () => (deathless() ? 1 : 0),
  reset: () => {
    resetBrannoc();
    resetAbilities();
    resetMotion();
  },
};
