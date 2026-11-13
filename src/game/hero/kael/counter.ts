import { KEEN_RAMP } from "../../../constants/combo";
import { COUNTER, COUNTER_MARK } from "../../../constants/kael/guard";
import { GROUND, W } from "../../../constants/stage";
import { glow, place, sparkle } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { createWarpLine } from "../../effects/warpLine";
import { enemyBox, walks } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { game, hero } from "../../state";
import { cutForSharedAction } from "../sharedCut";
import { arrive, strikeOnArrival } from "../warp";

/** the counter a parry opens: the foe it strikes and the seconds left to press J. Holds a foe, so only the host keeps it */
const counter: { foe: Enemy | null; left: number; t: number } = { foe: null, left: 0, t: 0 };
rememberPerSeat(objectMemory(counter, true));

/** the counter's foe while it is still open and the foe still stands */
const openFoe = (): Enemy | null => (counter.left > 0 && counter.foe && counter.foe.hp > 0 ? counter.foe : null);

/** where Kael lands for the counter: at the foe's back, on the side away from him, and the side he comes from */
function behind(e: Enemy): { x: number; y: number; side: number } {
  const box = enemyBox(e);
  const side = Math.sign(e.x - hero.x) || hero.face;
  const x = clamp(side > 0 ? box[2] + COUNTER_MARK.gap : box[0] - COUNTER_MARK.gap, 8, W - 8);
  const y = walks(e) ? e.y : Math.min(GROUND, e.y + 18);
  return { x, y, side };
}

/** a parry opens the counter on the foe that struck */
export function openCounter(foe: Enemy | null): void {
  counter.foe = foe;
  counter.left = foe ? COUNTER.window : 0;
  counter.t = 0;
}

export function tickCounter(dt: number): void {
  counter.left = Math.max(0, counter.left - dt);
  counter.t += dt;
  if (counter.left <= 0) counter.foe = null;
}

/** J tapped with the counter open: Kael blinks to the attacker's back and strikes it, a sure crit; true when he did */
export function pressCounter(): boolean {
  const e = openFoe();
  if (!e) return false;
  counter.left = 0;
  counter.foe = null;
  cutForSharedAction();
  const to = behind(e);
  game.fx.push(createWarpLine(hero.x, hero.y - 18, to.x, to.y - 18));
  arrive(to.x, to.y, e);
  hero.face = -to.side;
  strikeOnArrival(COUNTER.power, e, true);
  return true;
}

/** a gold mark at the attacker's back while the counter is open, where Kael will land */
export function drawCounter(): void {
  const e = openFoe();
  if (!e) return;
  const to = behind(e);
  const k = 0.6 + 0.4 * Math.abs(Math.sin(counter.t * COUNTER_MARK.pulse));
  place();
  sparkle(to.x, to.y - 20, COUNTER_MARK.arm * k + 1, KEEN_RAMP[4], WHITE, 0.6);
  glow(to.x, to.y - 20, 12, KEEN_RAMP[4], 0.4 * k);
}
