import { WENNA_STRIDE } from "../../../constants/wenna/motion";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { feat } from "../../feat";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { selectedSlot } from "../abilityBar";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { tickAbilities, WENNA_SLOTS } from "./abilities";
import { runAbilityCast } from "./abilityCast";
import { releaseCandle, tickCandleWarp } from "./candleWarp";
import { drawWenna, drawWennaBack, drawWennaOver } from "./draw";
import { clearDrips, dropDrip, stepDrips } from "./drips";
import { runGreatWick } from "./greatWick";
import { interceptBlow } from "./guard";
import { WENNA_GUARD } from "./guardStyle";
import "./hold";
import { pressJump } from "./jump";
import { runLightCast } from "./light";
import { resetWenna, wenna, wennaHost } from "./memory";
import { wennaPose } from "./pose";
import { clearQuarries, tickQuarries } from "./quarry";
import { cutString, inRecovery, landed, pressDrop, pressString, runDrop, runString } from "./string";
import { WENNA_WARP } from "./warpStyle";
import { flashWaxOnRefusal, trickleWax } from "./wax";
import { meltAll, stepWicks } from "./wickAi";
import { wickStriking } from "./wickKills";
import { clearWickMoves } from "./wickMoves";
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
  flashWaxOnRefusal(selectedSlot()?.id === "light", dt);
  tickAbilities(rechargeStep(dt));
  tickCandleWarp();
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
    case "throw":
      return releaseCandle();
    case "lamp":
      runString(dt);
      return true;
    case "lampDrop":
      runDrop(dt);
      return true;
    case "lightCast":
      runLightCast();
      return true;
    case "kindleCast":
    case "beckonCast":
    case "spellCast":
      runAbilityCast();
      return true;
    case "greatWick":
      runGreatWick();
      return true;
    default:
      return false;
  }
}

/** a foe she or her Wicks felled drips Wax for her; a Wick's kill counts toward Many Hands */
function onKill(e: Enemy): void {
  dropDrip(e);
  if (!wickStriking()) return;
  wenna.wickKills++;
  feat({ kind: "wickKills", kills: wenna.wickKills });
}

/**
 * Wenna: a short lamp string whose blows mark a Quarry; a thrown candle she trades places with on J held; the lantern
 * raised on K, whose parry blinds the foes ahead and lights a Wick; Light, Kindle, Beckon and her spell skills on I; and
 * Great Wick on U. Her Wicks walk to foes, hold minions and take blows meant for her.
 */
export const WENNA_KIT: HeroKit = {
  warp: WENNA_WARP,
  guard: WENNA_GUARD,
  abilities: WENNA_SLOTS,
  tick,
  readActions: () => {
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressDrop()));
  },
  mayAct: () => isFree() || inRecovery(),
  cutForAction: cutString,
  chooseMove: () => null,
  runState,
  pose: wennaPose,
  afterStrike: () => {},
  absorbHurt: interceptBlow,
  walkSpeed,
  stride: () => WENNA_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => hero.state === "greatWick",
  gravityScale: () => 1,
  drawBack: drawWennaBack,
  draw: drawWenna,
  drawOver: drawWennaOver,
  onKill,
  reset: () => {
    clearWicks();
    clearWickMoves();
    clearDrips();
    clearQuarries();
    resetWenna();
    resetMotion();
  },
};
