import { CLIPS } from "../../constants/clips";
import { MP_REGEN } from "../../constants/combat";
import { rechargeStep } from "../build/recharge";
import { isHeld } from "../input";
import { endRun } from "../runEnd";
import { hero, progress } from "../state";
import { settle } from "./actions";
import { animateHero } from "./animate";
import { runMove, tickCombo } from "./combo";
import { runDash } from "./dash";
import { tickDenied } from "./deny";
import { kit } from "./kits";
import { moveHero } from "./physics";
import { rechargeSpells, runCast } from "./spell";
import { regenStamina } from "./stamina";
import { readDoubleTap } from "./taps";
import { runCharge, runUltimate } from "./ultimate";
import { doWarp, releaseSword } from "./warp";

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
      if (h.st >= CLIPS.throw.hit) releaseSword();
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
  tickDenied(dt);
  h.riposte = Math.max(0, h.riposte - dt);
  h.sinceDash += dt;
  regenStamina(dt);
  tickCombo(dt);
  kit().tick(dt);
  if (h.running && dir !== h.face) h.running = false;
  if (h.state !== "dead") {
    h.mp = Math.min(progress.stats.mp, h.mp + (h.state === "hang" ? MP_REGEN.hanging : MP_REGEN.normal) * dt);
    kit().readActions(dir, tap);
  }
  // letting go of Up cuts a jump's rise short, also when an attack or a cast started on the way up
  if (!isHeld("up") && h.vy < -120 && !h.cutShort) {
    h.vy *= 0.55;
    h.cutShort = true;
  }
  if (!kit().runState(dt)) runState(dt);
  moveHero(dt, dir);
  animateHero(dt);
}
