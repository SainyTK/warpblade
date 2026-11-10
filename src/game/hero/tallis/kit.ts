import { PAL } from "../../../constants/palette";
import { TALLIS_STRIDE } from "../../../constants/tallis/motion";
import { VEIL } from "../../../constants/tallis/veil";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { PK } from "../../../types/particle";
import { rechargeStep } from "../../build/recharge";
import { unseenTouch } from "../../enemies/awareness";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, particles, rng } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities, tickAbilities } from "./abilities";
import { inCloud, stepClouds } from "./clouds";
import { drawTallis, drawTallisBack, drawTallisOver, tallisAlpha, tallisRing } from "./draw";
import { refillGloam } from "./gloam";
import { forgetDark, liftDark, runGloaming } from "./gloaming";
import { runHamstring } from "./hamstring";
import "./hooks";
import { pressJump } from "./jump";
import { watchLost } from "./lostCue";
import { isMarked, tickMarks } from "./marks";
import { resetTallis, tallis } from "./memory";
import { tallisPose } from "./pose";
import { poolDodge, pressSink, queueRisingCut, runRise, runSink, stepPlummet, tickSink } from "./sink";
import { runKnotCast } from "./smokeKnot";
import { runSpellCast } from "./spells/castSpell";
import { passMark } from "./spells/markDusk";
import {
  hopping,
  landed,
  pressDropStab,
  pressString,
  risingCutOpen,
  runDropStab,
  runRisingCut,
  runString,
  startRisingCut,
} from "./string";
import { endVeil, pressVeil, tickVeil } from "./veil";

/** foes cannot see him: in the Veil, in the pool, or standing in his own smoke */
const hidden = (): boolean => tallis.veil || hero.state === "sink" || inCloud();

/** his walk: quicker in the Veil, and quicker still with Quiet Step */
function walkSpeed(shared: number): number {
  if (!tallis.veil) return shared;
  return shared * VEIL.walk * (1 + (skillValues("t_quietStep").walk ?? 0));
}

/** thin ink wisps rise off his shoulders while he is veiled */
function wisps(): void {
  if (!tallis.veil || !rng.chance(0.3)) return;
  particles.spawn(
    PK.EMBER,
    hero.x + rng.range(-4, 3),
    hero.y - rng.range(17, 22),
    rng.range(-4, 4),
    -rng.range(10, 22),
    rng.range(0.4, 0.7),
    {
      sparks: [PAL.gloam[4], PAL.gloam[3], PAL.gloam[2], PAL.gloam[1]],
    },
  );
}

function tick(dt: number): void {
  const h = hero;
  refillGloam(dt);
  tickVeil(dt);
  tickAbilities(rechargeStep(dt));
  tickSink(dt);
  stepClouds(dt);
  tickMarks(dt);
  tallis.ambushLeft = Math.max(0, tallis.ambushLeft - dt);
  if (h.state !== "knife") tallis.link = Math.max(0, tallis.link - dt);
  if (h.state !== "knife" && tallis.link <= 0) h.chain = 0;
  if (h.state === "hurt" || h.state === "dead") tallis.plummet = false;
  if (h.state === "dead") {
    endVeil("hurt");
    liftDark();
  }
  forgetDark();
  if (h.ground) landed();
  stepPlummet();
  watchLost(hidden(), dt);
  wisps();
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "knife":
      runString(dt);
      return true;
    case "dropStab":
      runDropStab();
      return true;
    case "risingCut":
      runRisingCut(dt);
      return true;
    case "sink":
      runSink(dt);
      return true;
    case "rise":
      runRise();
      return true;
    case "knotCast":
      runKnotCast();
      return true;
    case "hamstring":
      runHamstring();
      return true;
    case "spellCast":
      runSpellCast();
      return true;
    case "gloaming":
    case "eclipse":
      runGloaming();
      return true;
    default:
      return false;
  }
}

/** states in which the kit moves him itself */
const DRIVEN = new Set(["sink", "rise", "risingCut", "dropStab", "gloaming", "eclipse"]);

/** J: Rising Cut out of the pool or just after a rise, the knife string on the floor, Drop Stab in the air */
function pressKnife(): boolean {
  if (queueRisingCut()) return true;
  if (risingCutOpen()) {
    startRisingCut();
    return true;
  }
  return hero.ground ? pressString() : pressDropStab();
}

/**
 * A blow meets him: nothing touches him in Gloaming or in the pool, a foe that cannot see him brushes past without harm,
 * and any blow that lands ends the Veil.
 */
function absorbHurt(_dmg: number, fromX: number): boolean {
  if (hero.state === "gloaming" || hero.state === "eclipse") return true;
  if (poolDodge()) return true;
  if (hero.inv > 0) return false;
  if (hidden() && unseenTouch(fromX)) return true;
  endVeil("hurt");
  return false;
}

/** a foe he felled that Mark of Dusk marked passes its mark on */
function onKill(e: Enemy): void {
  if (isMarked(e)) passMark(e);
}

/**
 * Tallis: a knife string that changes behind a foe's back, the Veil on K that hides him from minions for Gloam, Sink
 * on L that glides under foes as a shadow pool, Smoke Knot and Hamstring on I (O turns through them and his spell
 * skills), and Gloaming on U. Gloam refills while no foe faces him.
 */
export const TALLIS_KIT: HeroKit = {
  tick,
  readActions: () => {
    use("dash", pressSink);
    use("up", pressJump);
    use("attack", pressKnife);
    use("warp", pressVeil);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: tallisPose,
  afterStrike: () => {},
  absorbHurt,
  walkSpeed,
  stride: () => TALLIS_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => DRIVEN.has(hero.state) || tallis.plummet || hopping(),
  gravityScale: () =>
    hero.state === "gloaming" || hero.state === "eclipse" || (hero.state === "dropStab" && !tallis.diving) ? 0 : 1,
  drawBack: drawTallisBack,
  draw: drawTallis,
  drawOver: drawTallisOver,
  heroAlpha: tallisAlpha,
  heroRing: tallisRing,
  hidden,
  onKill,
  reset: () => {
    liftDark();
    resetTallis();
    resetAbilities();
    resetMotion();
  },
};
