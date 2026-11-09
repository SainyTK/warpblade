import { WENNA_STRIDE } from "../../../constants/wenna/motion";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { feat } from "../../feat";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities, tickAbilities } from "./abilities";
import { runAbilityCast } from "./abilityCast";
import { drawWenna, drawWennaBack, drawWennaOver } from "./draw";
import { clearDrips, dropDrip, stepDrips } from "./drips";
import { runGreatWick } from "./greatWick";
import { interceptBlow } from "./guard";
import "./hold";
import { pressJump } from "./jump";
import { pressLight, runLightCast } from "./light";
import { resetWenna, wenna, wennaHost } from "./memory";
import { wennaPose } from "./pose";
import { clearQuarries, tickQuarries } from "./quarry";
import { landed, pressDrop, pressString, runDrop, runString } from "./string";
import { pressSwap, runSwap, swapDodge, swapGone, tickSwap } from "./swap";
import { trickleWax } from "./wax";
import { meltAll, stepWicks } from "./wickAi";
import { wickStriking } from "./wickKills";
import { liveWicks, spawnWick } from "./wicks";
import { clearWicks, dropMelted } from "./wickWorld";

/** her walk: Procession quickens it for each Wick lit */
function walkSpeed(shared: number): number {
  const per = skillValues("w_procession").walk ?? 0;
  return per ? shared * (1 + per * liveWicks().length) : shared;
}

/** places where her Wicks bite faster run out */
function tickZones(dt: number): void {
  for (const z of wennaHost.zones) z.left -= dt;
  wennaHost.zones = wennaHost.zones.filter((z) => z.left > 0);
}

/** every wave opens with bodies in front of her: Wicks light for free when she has none */
function openWave(): void {
  if (game.lull !== "fight" || game.wave === wenna.waveSeen) return;
  wenna.waveSeen = game.wave;
  if (liveWicks().length) return;
  for (let i = 0; i < WICK.waveStart; i++) spawnWick(hero.x + hero.face * (14 + i * 10), hero.y, "wave");
}

function tick(dt: number): void {
  const h = hero;
  trickleWax(dt);
  tickAbilities(rechargeStep(dt));
  tickSwap(dt);
  tickQuarries(dt);
  tickZones(dt);
  if (h.state !== "lamp") wenna.link = Math.max(0, wenna.link - dt);
  if (h.state !== "lamp" && wenna.link <= 0) h.chain = 0;
  if (h.state === "dead") {
    meltAll();
    clearQuarries();
  } else openWave();
  if (h.ground) landed();
  stepWicks(dt);
  stepDrips(dt);
  dropMelted(WICK.melt);
  wenna.wicks = liveWicks().length;
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "lamp":
      runString(dt);
      return true;
    case "lampDrop":
      runDrop(dt);
      return true;
    case "lightCast":
      runLightCast();
      return true;
    case "swap":
      runSwap();
      return true;
    case "kindleCast":
    case "beckonCast":
    case "spellCast":
      runAbilityCast();
      return true;
    case "greatWick":
    case "thousand":
      runGreatWick();
      return true;
    default:
      return false;
  }
}

/** states in which the kit holds her still itself */
const DRIVEN = new Set(["swap", "greatWick", "thousand"]);

/** a foe she or her Wicks felled drips Wax for her; a Wick's kill counts toward Many Hands */
function onKill(e: Enemy): void {
  dropDrip(e);
  if (!wickStriking()) return;
  wenna.wickKills++;
  feat({ kind: "wickKills", kills: wenna.wickKills });
}

/**
 * Wenna: a short lamp string whose blows mark a Quarry, Wicks lit on K for Wax that walk to foes, hold minions and take
 * blows meant for her, Swap on L that trades her place with a Wick, Kindle and Beckon on I (O turns through them and her
 * spell skills), and Great Wick on U.
 */
export const WENNA_KIT: HeroKit = {
  tick,
  readActions: () => {
    use("dash", pressSwap);
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressDrop()));
    use("warp", pressLight);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: wennaPose,
  afterStrike: () => {},
  absorbHurt: (dmg, fromX) => swapDodge() || interceptBlow(dmg, fromX),
  walkSpeed,
  stride: () => WENNA_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => DRIVEN.has(hero.state),
  gravityScale: () => (hero.state === "swap" ? 0 : 1),
  drawBack: drawWennaBack,
  draw: drawWenna,
  drawOver: drawWennaOver,
  heroAlpha: () => (swapGone() ? 0 : 1),
  onKill,
  reset: () => {
    clearWicks();
    clearDrips();
    clearQuarries();
    resetWenna();
    resetAbilities();
    resetMotion();
  },
};
