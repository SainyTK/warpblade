import { FURY } from "../../../constants/brannoc/fury";
import { BRANNOC_STRIDE } from "../../../constants/brannoc/moves";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { feat } from "../../feat";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, progress } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { BRANNOC_SLOTS, tickAbilities } from "./abilities";
import { deathless, extendOnKill, runLastCleave, runRoar, tickBerserk, untouchable } from "./berserk";
import { runCast } from "./cast";
import { repayOnHit, tickDebt } from "./debt";
import { runFrenzy, steadfast, tickFrenzy } from "./frenzy";
import { attackRate, furyDamage, isBloodied, walkSpeed, watchBloodied } from "./fury";
import { BRANNOC_GUARD_STYLE } from "./guardStyle";
import { pressJump } from "./jump";
import { drawBerserkTint, dressBrannoc, tickSteam } from "./look";
import { brannoc, brannocHost, resetBrannoc } from "./memory";
import { brannocPose } from "./pose";
import { endString, inRecovery, landed, pressHatchet, pressString, runHatchet, runString, tickLink } from "./string";
import { BRANNOC_WARP } from "./warpStyle";

/** while the axe is wound back for his warp, where he stands is where the Hunt leaves from */
function watchThrow(): void {
  if (hero.state !== "throw") return;
  brannocHost.from = hero.x;
  brannocHost.air = !hero.ground;
}

function tick(dt: number): void {
  tickDebt(dt);
  watchBloodied(dt);
  tickFrenzy(dt);
  tickBerserk(dt);
  tickAbilities(rechargeStep(dt));
  tickLink(dt);
  tickSteam(dt);
  watchThrow();
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

/** a foe fell to one of his hits: Bloodthirst heals while Bloodied, On the Edge counts it, and Berserk lasts */
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
 * Brannoc: his HP is his resource. Frenzy and his abilities on I cost HP, which becomes a debt he wins back by landing
 * blows before a foe lands one on him; every point of missing HP is Fury, and below 35% he is Bloodied and his Cleave
 * spins twice. His warp is the Hunt: the great axe hurled into a foe and ripped out with a chop. His guard bleeds into
 * the debt, and its parry, Blood Answer, pays the whole debt back and starts Frenzy for free. Berserk (U) keeps him
 * standing for a few seconds.
 */
export const BRANNOC_KIT: HeroKit = {
  warp: BRANNOC_WARP,
  guard: BRANNOC_GUARD_STYLE,
  abilities: BRANNOC_SLOTS,
  tick,
  readActions: () => {
    use("up", pressJump);
    use("attack", pressAxe);
  },
  chooseMove: () => null,
  runState,
  pose: brannocPose,
  afterStrike: () => {},
  mayAct: () => isFree() || inRecovery(),
  cutForAction: () => {
    if (hero.state === "axe") endString();
  },
  absorbHurt: untouchable,
  attackRate,
  walkSpeed,
  stride: () => BRANNOC_STRIDE,
  hurtScale: () => 1,
  damageScale: furyDamage,
  steadfast,
  drivesMotion: () => hero.state === "hatchet",
  gravityScale: () => 1,
  drawBack: dressBrannoc,
  drawOver: drawBerserkTint,
  onKill,
  landed: (e, hit) => repayOnHit(e, hit.crit, hit.kill),
  hpFloor: () => (deathless() ? 1 : 0),
  reset: () => {
    resetBrannoc();
    resetMotion();
  },
};
