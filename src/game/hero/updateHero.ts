import { CLIPS } from "../../constants/clips";
import { MP_REGEN } from "../../constants/combat";
import { sfx } from "../../services/audio";
import { rechargeStep } from "../build/recharge";
import { isHeld, take, use } from "../input";
import { endRun } from "../runEnd";
import { hero, progress } from "../state";
import { cycleAbility, pressAbility } from "./abilityBar";
import { settle } from "./actions";
import { animateHero } from "./animate";
import { runMove, tickCombo } from "./combo";
import { runDash, tryDash } from "./dash";
import { tickDenied } from "./deny";
import { holdGuard, pressGuard, runGuard, tickGuard } from "./heroGuard";
import { kit } from "./kits";
import { moveHero } from "./physics";
import { rechargeSpells, runCast } from "./spell";
import { regenStamina } from "./stamina";
import { tickTakeoff } from "./takeoff";
import { readDoubleTap } from "./taps";
import { runCharge, runUltimate, startCharge } from "./ultimate";
import { doWarp, pressWarp, releaseWeapon, tickWarp } from "./warp";

function runState(dt: number): void {
  const h = hero;
  switch (h.state) {
    case "move":
      runMove(dt);
      break;
    case "cast":
      runCast();
      if (h.st >= CLIPS.cast.dur) settle();
      break;
    case "throw":
      if (h.st >= CLIPS.throw.hit) releaseWeapon();
      break;
    case "throwWait":
      h.sword?.update(dt);
      if (h.sword?.done && h.warpTarget) doWarp(h.warpTarget);
      break;
    case "warpStrike":
      if (h.st >= CLIPS.warpStrike.dur) settle();
      break;
    case "dash":
      runDash(dt);
      break;
    case "guard":
      runGuard(dt);
      break;
    case "charge":
      runCharge(dt);
      break;
    case "ultimate":
      runUltimate();
      break;
    case "hurt":
      if (h.st >= 0.32) settle();
      break;
    case "dead":
      if (h.st >= 2.4) endRun("fallen");
      break;
    default:
  }
}

/**
 * Use waiting presses. The front dodge goes first so it can cancel; the kit then reads its own (jump, the string on J
 * tapped, and anything its states take over); then the moveset every hero shares: J held warps, K guards, I casts (held,
 * the wide form), O switches ability and U charges the ultimate. A press that cannot act yet stays buffered a moment.
 */
function readActions(dir: number, tap: number): void {
  use("dash", () => tryDash(dir));
  kit().readActions(dir, tap);
  use("warp", pressWarp);
  use("guard", pressGuard);
  holdGuard();
  use("cast", () => pressAbility(false));
  use("castWide", () => pressAbility(true));
  if (take("cycle") && cycleAbility()) sfx.pickup();
  use("ultimate", startCharge);
}

/** how fast the current action's clock runs: attack speed (and the kit's own boost) for moves */
function clockRate(): number {
  if (hero.state === "move") return progress.stats.aspd * (kit().attackRate?.() ?? 1);
  return 1;
}

export function updateHero(dt: number): void {
  const h = hero;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  const tap = readDoubleTap(dir);
  h.st += dt * clockRate();
  h.inv = Math.max(0, h.inv - dt);
  h.drop = Math.max(0, h.drop - dt);
  const recharge = rechargeStep(dt);
  h.warpCd = Math.max(0, h.warpCd - recharge);
  h.ultCd = Math.max(0, h.ultCd - recharge);
  rechargeSpells(recharge);
  tickWarp();
  tickGuard(dt);
  tickDenied(dt);
  h.riposte = Math.max(0, h.riposte - dt);
  regenStamina(dt);
  tickCombo(dt);
  kit().tick(dt);
  tickTakeoff(dt);
  if (h.running && dir !== h.face) h.running = false;
  if (h.state !== "dead") {
    h.mp = Math.min(progress.stats.mp, h.mp + (h.state === "hang" ? MP_REGEN.hanging : MP_REGEN.normal) * dt);
    readActions(dir, tap);
  }
  if (!kit().runState(dt)) runState(dt);
  moveHero(dt, dir);
  animateHero(dt);
}
