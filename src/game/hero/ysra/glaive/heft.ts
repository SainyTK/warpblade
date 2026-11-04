import { HEFT } from "../../../../constants/ysra/glaive";
import { sfx } from "../../../../services/audio";
import { clamp } from "../../../../utils/math";
import { isHeld } from "../../../input";
import { game, hero, progress } from "../../../state";
import { setState } from "../../actions";
import { startMove } from "../../combo";
import { createHeftGlow } from "./effects/heftGlow";
import { setLungeCharge } from "./lunge";

/** the held draw: charge seconds so far, scaled by Deep Heft; whether the hip thrust under way may still become one */
const heft = { charge: 0, watching: false, full: false };

/** the heft's last stretch quivers on a loop this long once the wind is full */
const QUIVER = 0.3;

/** how far the wind has come, 0 to 1 */
const share = (): number => clamp(heft.charge / HEFT.full);
const rate = (): number => 1 + (progress.ranks[HEFT.skill] ?? 0) * HEFT.ratePerRank;

/** the string's opening hip thrust was just started by a fresh J: if J stays held it becomes a heft */
export function watchHeft(): void {
  heft.watching = true;
}

function enterHeft(): void {
  const h = hero;
  heft.watching = false;
  heft.charge = HEFT.after * rate();
  heft.full = false;
  Object.assign(h, { move: null, chain: 0, queued: null, link: 0, vx: 0 });
  setState("heft");
  game.fx.push(createHeftGlow(share));
  sfx.chargeStep(0);
}

/** before presses are read: the watched hip thrust turns into a heft once J has been held long enough */
export function tickHeft(): void {
  if (!heft.watching) return;
  const h = hero;
  if (!isHeld("attack") || h.state !== "move" || h.move !== "hipThrust" || h.hitIndex > 0) {
    heft.watching = false;
    return;
  }
  if (h.st >= HEFT.after) enterHeft();
}

/** let go: a quick poke before the short mark, otherwise the lunge, as long and hard as the wind */
function release(): void {
  if (heft.charge < HEFT.poke) {
    startMove("heftPoke");
    return;
  }
  setLungeCharge(clamp((heft.charge - HEFT.poke) / (HEFT.full - HEFT.poke)));
  startMove("heftLunge");
}

/** while J is held: feet set, she may turn but not walk, the glaive draws back with the charge */
export function runHeft(dt: number): boolean {
  const h = hero;
  if (h.state !== "heft") return false;
  h.vx = 0;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  if (dir) h.face = dir;
  heft.charge += dt * rate();
  if (!heft.full && heft.charge >= HEFT.full) {
    heft.full = true;
    sfx.chargeStep(2);
  }
  // the clip's clock is the charge: the draw, then the quiver repeating at full
  h.st = heft.full ? HEFT.full + ((heft.charge - HEFT.full) % QUIVER) : heft.charge;
  if (!isHeld("attack") || !h.ground) release();
  return true;
}

export function resetHeft(): void {
  heft.watching = false;
  heft.charge = 0;
  heft.full = false;
}
